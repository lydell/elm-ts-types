# elm-ts-types

Generate TypeScript typings for the JavaScript interface of Elm apps.

## Installation

```
npm install elm-ts-types
```

```ts
import { generateTypeScript } from "elm-ts-types";
```

The `generateTypeScript` function should work in any standard JavaScript runtime – it does not depend on anything from Node.js or npm. But it’s available as an npm package for convenience.

It takes the compiled Elm JavaScript code as a string, and returns TypeScript type definitions for it as a string.

If you use [elm-watch](https://lydell.github.io/elm-watch/), you can run `generateTypeScript` as part of its [postprocess](https://lydell.github.io/elm-watch/postprocess/#elm-watch-node) feature – see [postprocess.js](./postprocess.js) in this repo for inspiration. (The elm-watch docs warn against doing side effects during postprocessing, but writing `.d.ts` files should be fine.)

## Example

Consider this small Elm program:

```elm
port module ReadmeExample exposing (main)

import Browser
import Html exposing (Html)
import Html.Events


port print : { title : String, pages : List String } -> Cmd msg


port printFailed : (String -> msg) -> Sub msg


type Msg
    = PrintClicked
    | PrintFailed String


type alias Model =
    { pages : List String
    , error : Maybe String
    }


type alias Flags =
    { text : String
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { pages = flags.text |> String.split "\n\n"
      , error = Nothing
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PrintClicked ->
            ( model, print { title = "Document preview", pages = model.pages } )

        PrintFailed error ->
            ( { model | error = Just error }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    printFailed PrintFailed


view : Model -> Html Msg
view model =
    Html.div []
        [ Html.button [ Html.Events.onClick PrintClicked ]
            [ Html.text "Print" ]
        , case model.error of
            Just error ->
                Html.p []
                    [ Html.text error ]

            Nothing ->
                Html.text ""
        ]


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
```

If you compile the above Elm code to JavaScript using `elm make` and then give that JavaScript as a string to the `generateTypeScript` function, you get the following string as output:

```ts
declare namespace Elm {
    namespace ReadmeExample {
        export function init(args: {
            flags: { "text": string },
            node: Node
        }): {
            ports: {
                printFailed: {
                    send: (value: string) => void
                },
                print: {
                    subscribe: (f: (value: {
                        "pages": Array<string>,
                        "title": string
                    }) => Promise<void>) => void,
                    unsubscribe: (f: (value: {
                        "pages": Array<string>,
                        "title": string
                    }) => Promise<void>) => void
                }
            }
        };
    }
}
```

Notice how:

- You are required to pass the correct flags.
- You are required to pass a node to mount the app on, since it is an `Browser.element` program.
- All port names are known, and whether they are `send` or `subscribe` ports, and what the types for the data flowing through the ports have.

## How to use the generated TypeScript types

If you stick the output from the above example in a `.d.ts` file, TypeScript will allow you to access an `Elm` global variable: It will let you access `Elm.ReadmeExample.init`, and it will know that `init` is a function and what arguments it takes and what it returns. `window.Elm` should also be known to TypeScript.

If you use a tool that turns Elm’s JavaScript code into an ESM module, add one the following:

```ts
export default Elm;
```

```ts
export const Elm: typeof Elm;
```

Thanks to the `export`, the `Elm` namespace is no longer global. Choose one of the above, or adjust to your needs, depending on exactly how your ESM tool generates the export.

## Why return `Promise<void>` when subscribing to ports?

The typical way of subscribing to a port is:

```ts
app.ports.myPort.subscribe(() => {
    doSomething();
})
```

However, that will cause a TypeScript error with the generated types. That’s because the return type of the lambda function above is `void`, while the generated types say that it should be `Promise<void>`. Why is that? It’s to nudge you into using an `async` function:

```ts
app.ports.myPort.subscribe(async () => {
    //                     ^^^^^
    doSomething();
})
```

The thing with `async` functions is that they never throw errors. They _always_ return a promise, and thrown errors are caught and reject that promise instead. Basically, by typing `async` you get a try-catch wrapper around your function for free.

Elm doesn’t do anything with the return value, but the try-catch behavior is useful. Take this Elm code for example:

```elm
    Cmd.batch
        [ Http.post something
        , myPort ()
        ]
```

You might think that the two batched commands are completely independent. But if you accidentally throw an error in the `myPort` callback, that can prevent the HTTP request from happening at all. If that thrown error is wrapped up in a `Promise`, the rest of the code execution is unaffected, and the error will still appear in the browser console – as an “unhandled promise rejection” instead of as an “uncaught error”.

If you really dislike this, or can’t use `async` functions, feel free to run `.replaceAll("Promise<void>", "void")` on the output from `generateTypeScript`.

Note that another way of making TypeScript happy is adding `return Promise.resolve()` at the end of your function. However, that defeats the purpose of the whole thing, since that gives none of the try-catch semantics of `async` that we’re after.

## How this works under the hood

`generateTypeScript` is implemented in the most _lol_ way possible: It injects some code into the compiled Elm JavaScript, so that initializing an app no longer actually starts the app, it just returns the ports. And the generated flags decoder. It also injects code so that ports no longer do anything, they just return their generated encoders and decoders. And those don’t encode or decode anything anymore, they just return the types they are operating on as strings. After the injection, the code is eval:ed! (Don’t run `generateTypeScript` on untrusted input.) That gives back data which is then turned into TypeScript type definition syntax.

It might sound a bit insane (and it is), but it is way easier than writing a parser and figuring everything out from scratch. The compiler has already done the job, and hid the result inside the compiled JavaScript. The _lol_ approach is pretty much guaranteed to be in sync with what the compiler actually does.

## Enforcing that you subscribe to all ports

It’s possible to define a port `print` in Elm, use it in Elm, and then forget to subscribe on it on the TypeScript side. Here’s a little utility function that can help you with that:

```ts
function subscribeAll<Ports extends Record<string, any>>(
    ports: Ports,
    handlers: {
        [
            K in keyof Ports as Ports[K] extends {
                subscribe: (f: infer _) => void;
            }
                ? K
                : never
        ]:
            Ports[K] extends {
                subscribe: (f: infer F) => void;
            }
                ? F
                : never;
    }
): void {
    for (const key in handlers) {
        ports[key].subscribe(handlers[key]);
    }
}
```

Instead of calling `app.ports.print.subscribe(myFunction)`, you instead call:

```ts
subscribeAll(app.ports, {
    print: myFunction,
});
```

If you later add another port that needs to be subscribed to, TypeScript will mark the above call as an error, forcing you to mention the new port in that object as well.
