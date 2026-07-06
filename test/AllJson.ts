const payload: Parameters<typeof Elm.AllJson.init>[0]["flags"] = {
    arrayOfString: [""],
    bool: false,
    float: 0.5,
    int: 1,
    json: Function.prototype,
    listOfListsOfInt: [[1]],
    listOfLongObject: [{
        first: 1,
        last: true,
        second: 2,
    }],
    listOfObject: [{ nested: 3 }],
    listOfString: [""],
    longObject: {
        first: 1,
        last: true,
        second: 2,
    },
    maybe: null,
    null: null,
    object: { nested: "" },
    string: "",
    triple: [1, {
        first: 1,
        last: true,
        second: 2,
    }, [1]],
    tuple: [false, -1],
};

const app = Elm.AllJson.init({
    flags: payload,
});

app.ports.incoming.send(payload);

app.ports.outgoing.subscribe(async (p) => {
    p.triple[1].first.toFixed(2);
    p = payload;
    // @ts-expect-error Type '{}' is missing the following properties from type '{ arrayOfString: string[]; bool: boolean; float: float; int: number; json: unknown; listOfListsOfInt: number[][]; listOfLongObject: { first: number; last: boolean; second: float; }[]; listOfObject: { nested: number; }[]; listOfString: string[]; ... 6 more ...; tuple: [...]; }': "arrayOfString", "bool", "float", "int", and 12 more.
    p = {};
});
