module Element exposing (main)

import Browser
import Html
import Shared exposing (Payload)


main : Program Payload Payload Payload
main =
    Browser.element
        { init = \payload -> ( payload, Cmd.none )
        , update = \_ payload -> ( payload, Shared.outgoing payload )
        , subscriptions = \_ -> Shared.incoming identity
        , view = \_ -> Html.text ""
        }
