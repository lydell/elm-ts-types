module DocumentNoFlagsNoPorts exposing (main)

import Browser


main : Program () () ()
main =
    Browser.document
        { init = \() -> ( (), Cmd.none )
        , update = \_ model -> ( model, Cmd.none )
        , subscriptions = \_ -> Sub.none
        , view = \_ -> { title = "", body = [] }
        }
