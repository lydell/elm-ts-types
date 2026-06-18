port module Shared exposing (..)

import Json.Encode


port incoming : (Payload -> msg) -> Sub msg


port outgoing : Payload -> Cmd msg


type alias Payload =
    { null : ()
    , bool : Bool
    , int : Int
    , float : Float
    , string : String
    , listOfStrings : List String
    , object : { nested : String }
    , tuple : ( Bool, Int )
    , triple : ( Float, String, List Int )
    , maybe : Maybe Int
    , json : Json.Encode.Value
    }
