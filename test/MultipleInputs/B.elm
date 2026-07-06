port module MultipleInputs.B exposing (main)


port b_outgoing : String -> Cmd msg


port b_incoming : (String -> msg) -> Sub msg


main : Program String String String
main =
    Platform.worker
        { init = \s -> ( s, Cmd.none )
        , update = \_ s -> ( s, b_outgoing s )
        , subscriptions = \_ -> b_incoming identity
        }
