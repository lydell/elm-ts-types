port module DocumentJsonValue exposing (main)

import Browser
import Json.Decode exposing (Value)


port outgoing : Value -> Cmd msg


port incoming : (Value -> msg) -> Sub msg


main : Program Value Value Value
main =
    Browser.document
        { init = \s -> ( s, Cmd.none )
        , update = \_ s -> ( s, outgoing s )
        , subscriptions = \_ -> incoming identity
        , view = \_ -> { title = "", body = [] }
        }
