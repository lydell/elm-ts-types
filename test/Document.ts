const app = Elm.Document.init({
    flags: ""
});

app.ports.incoming.send("");

app.ports.outgoing.subscribe(async (s) => {
    console.log(s.toUpperCase());
});

const handler: Parameters<typeof app.ports.outgoing.subscribe>[0] = async (s) => {
    console.log(s.toUpperCase());
};
app.ports.outgoing.subscribe(handler);
app.ports.outgoing.unsubscribe(handler);

// @ts-expect-error Expected 1 arguments, but got 0.
Elm.Document.init();

Elm.Document.init({
    flags: "",
    // @ts-expect-error Object literal may only specify known properties, and 'node' does not exist in type '{ flags: string; }'.
    node: document.body
});

// Other global apps should be accessible:
Elm.DocumentNoFlagsNoPorts;
// ESM should not be global:
// @ts-expect-error Property 'ESM' does not exist on type 'typeof Elm'.
Elm.ESM;
