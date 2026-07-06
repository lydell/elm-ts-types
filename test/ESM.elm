port module ESM exposing (main)


port outgoing : String -> Cmd msg


port incoming : (String -> msg) -> Sub msg


main : Program String String String
main =
    Platform.worker
        { init = \s -> ( s, Cmd.none )
        , update = \_ s -> ( s, outgoing s )
        , subscriptions = \_ -> incoming identity
        }
