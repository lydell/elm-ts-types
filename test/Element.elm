port module Element exposing (main)

import Browser
import Html


port outgoing : String -> Cmd msg


port incoming : (String -> msg) -> Sub msg


main : Program String String String
main =
    Browser.element
        { init = \s -> ( s, Cmd.none )
        , update = \_ s -> ( s, outgoing s )
        , subscriptions = \_ -> incoming identity
        , view = \_ -> Html.text ""
        }
