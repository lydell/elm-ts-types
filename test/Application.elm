port module Application exposing (main)

import Browser


port outgoing : String -> Cmd msg


port incoming : (String -> msg) -> Sub msg


main : Program String String String
main =
    Browser.application
        { init = \s _ _ -> ( s, Cmd.none )
        , update = \_ s -> ( s, outgoing s )
        , subscriptions = \_ -> incoming identity
        , view = \_ -> { title = "", body = [] }
        , onUrlChange = \_ -> ""
        , onUrlRequest = \_ -> ""
        }
