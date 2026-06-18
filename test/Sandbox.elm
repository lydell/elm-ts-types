module Sandbox exposing (main)

import Browser
import Html


main : Program () () ()
main =
    Browser.sandbox
        { init = ()
        , update = \_ model -> model
        , view = \_ -> Html.text ""
        }
