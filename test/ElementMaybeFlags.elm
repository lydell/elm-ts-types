module ElementMaybeFlags exposing (main)

import Browser
import Html


type alias Payload =
    Maybe Int


main : Program Payload Payload Payload
main =
    Browser.element
        { init = \payload -> ( payload, Cmd.none )
        , update = \_ payload -> ( payload, Cmd.none )
        , subscriptions = \_ -> Sub.none
        , view = \_ -> Html.text ""
        }
