module Application exposing (main)

import Browser
import Html
import Shared exposing (Payload)


main : Program Payload Payload (Maybe Payload)
main =
    Browser.application
        { init = \payload _ _ -> ( payload, Cmd.none )
        , update = \_ payload -> ( payload, Shared.outgoing payload )
        , subscriptions = \_ -> Shared.incoming Just
        , view = \_ -> { title = "", body = [] }
        , onUrlChange = \_ -> Nothing
        , onUrlRequest = \_ -> Nothing
        }
