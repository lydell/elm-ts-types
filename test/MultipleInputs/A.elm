port module MultipleInputs.A exposing (main)


port a_outgoing : String -> Cmd msg


port a_incoming : (String -> msg) -> Sub msg


main : Program String String String
main =
    Platform.worker
        { init = \s -> ( s, Cmd.none )
        , update = \_ s -> ( s, a_outgoing s )
        , subscriptions = \_ -> a_incoming identity
        }
