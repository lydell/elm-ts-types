port module Shared exposing (..)

import Array exposing (Array)
import Json.Encode


port incoming : (Payload -> msg) -> Sub msg


port outgoing : Payload -> Cmd msg


type alias Payload =
    { null : ()
    , bool : Bool
    , int : Int
    , float : Float
    , string : String
    , listOfString : List String
    , listOfObject : List { nested : Int }
    , listOfLongObject : List { first : Int, second : Float, last : Bool }
    , listOfListsOfInt : List (List Int)
    , arrayOfString : Array String
    , object : { nested : String }
    , longObject : { first : Int, second : Float, last : Bool }
    , tuple : ( Bool, Int )
    , triple : ( Float, { first : Int, second : Float, last : Bool }, List Int )
    , maybe : Maybe Int
    , json : Json.Encode.Value
    }
