port module Main exposing (main)

import Browser
import Html exposing (Html)
import Json.Encode


port incoming : (Flags -> msg) -> Sub msg


port outgoing : Flags -> Cmd msg


main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }


type alias Model =
    { flags : Flags
    }


type Msg
    = Incoming Flags


type alias Flags =
    { null : ()
    , bool : Bool
    , int : Int
    , float : Float
    , string : String
    , list : List String
    , object : { maybe : Maybe Int }
    , tuple : ( Int, String )
    , triple : ( Int, String, Bool )
    , json : Json.Encode.Value
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { flags = flags }, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, outgoing model.flags )


subscriptions : Model -> Sub Msg
subscriptions _ =
    incoming Incoming


view : Model -> Html Msg
view _ =
    Html.text ""
