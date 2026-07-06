const app = Elm.Worker.init({
    flags: ""
});

app.ports.incoming.send("");

app.ports.outgoing.subscribe(async (s) => {
    console.log(s.toUpperCase());
});

Elm.Worker.init({
    flags: "",
    // @ts-expect-error Object literal may only specify known properties, and 'node' does not exist in type '{ flags: string; }'.
    node: document.body
});
