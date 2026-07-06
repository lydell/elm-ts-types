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
