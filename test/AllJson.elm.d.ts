// Generated file! Manual edits will be lost.
declare namespace Elm {
    namespace AllJson {
        export function init(args: {
            flags: {
                "arrayOfString": Array<string>,
                "bool": boolean,
                "float": number,
                "int": number,
                "json": unknown,
                "listOfListsOfInt": Array<Array<number>>,
                "listOfLongObject": Array<{
                    "first": number,
                    "last": boolean,
                    "second": number
                }>,
                "listOfObject": Array<{ "nested": number }>,
                "listOfString": Array<string>,
                "longObject": {
                    "first": number,
                    "last": boolean,
                    "second": number
                },
                "maybe": null | number,
                "null": null,
                "object": { "nested": string },
                "string": string,
                "triple": [ number, {
                    "first": number,
                    "last": boolean,
                    "second": number
                }, Array<number> ],
                "tuple": [ boolean, number ]
            }
        }): {
            ports: {
                incoming: {
                    send: (value: {
                        "arrayOfString": Array<string>,
                        "bool": boolean,
                        "float": number,
                        "int": number,
                        "json": unknown,
                        "listOfListsOfInt": Array<Array<number>>,
                        "listOfLongObject": Array<{
                            "first": number,
                            "last": boolean,
                            "second": number
                        }>,
                        "listOfObject": Array<{ "nested": number }>,
                        "listOfString": Array<string>,
                        "longObject": {
                            "first": number,
                            "last": boolean,
                            "second": number
                        },
                        "maybe": null | number,
                        "null": null,
                        "object": { "nested": string },
                        "string": string,
                        "triple": [ number, {
                            "first": number,
                            "last": boolean,
                            "second": number
                        }, Array<number> ],
                        "tuple": [ boolean, number ]
                    }) => void
                },
                outgoing: {
                    subscribe: (f: (value: {
                        "arrayOfString": Array<string>,
                        "bool": boolean,
                        "float": float,
                        "int": number,
                        "json": unknown,
                        "listOfListsOfInt": Array<Array<number>>,
                        "listOfLongObject": Array<{
                            "first": number,
                            "last": boolean,
                            "second": float
                        }>,
                        "listOfObject": Array<{ "nested": number }>,
                        "listOfString": Array<string>,
                        "longObject": {
                            "first": number,
                            "last": boolean,
                            "second": float
                        },
                        "maybe": number | null,
                        "null": null,
                        "object": { "nested": string },
                        "string": string,
                        "triple": [ float, {
                            "first": number,
                            "last": boolean,
                            "second": float
                        }, Array<number> ],
                        "tuple": [ boolean, number ]
                    }) => Promise<void>) => void,
                    unsubscribe: (f: (value: {
                        "arrayOfString": Array<string>,
                        "bool": boolean,
                        "float": float,
                        "int": number,
                        "json": unknown,
                        "listOfListsOfInt": Array<Array<number>>,
                        "listOfLongObject": Array<{
                            "first": number,
                            "last": boolean,
                            "second": float
                        }>,
                        "listOfObject": Array<{ "nested": number }>,
                        "listOfString": Array<string>,
                        "longObject": {
                            "first": number,
                            "last": boolean,
                            "second": float
                        },
                        "maybe": number | null,
                        "null": null,
                        "object": { "nested": string },
                        "string": string,
                        "triple": [ float, {
                            "first": number,
                            "last": boolean,
                            "second": float
                        }, Array<number> ],
                        "tuple": [ boolean, number ]
                    }) => Promise<void>) => void
                }
            }
        };
    }
}