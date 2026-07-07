const app = Elm.DocumentJsonValue.init({
    flags: ""
});

app.ports.incoming.send("");
app.ports.incoming.send(1);
app.ports.incoming.send({ one: 1, two: "2" });
app.ports.incoming.send(null);
app.ports.incoming.send(Function.prototype);

app.ports.outgoing.subscribe(async (s) => {
    // @ts-expect-error 's' is of type 'unknown'.
    s.toUpperCase();
});

Elm.DocumentJsonValue.init({ flags: 1 });
Elm.DocumentJsonValue.init({ flags: { one: 1, two: "2" } });
Elm.DocumentJsonValue.init({ flags: null });
Elm.DocumentJsonValue.init({ flags: Function.prototype });

Elm.DocumentJsonValue.init(
    // @ts-expect-error Property 'flags' is missing in type '{}' but required in type '{ flags: unknown; }'.
    {}
);
