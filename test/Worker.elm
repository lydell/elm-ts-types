module Worker exposing (main)

import Shared exposing (Payload)


main : Program Payload Payload Payload
main =
    Platform.worker
        { init = \payload -> ( payload, Cmd.none )
        , update = \_ payload -> ( payload, Shared.outgoing payload )
        , subscriptions = \_ -> Shared.incoming identity
        }
