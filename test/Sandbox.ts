const app = Elm.Sandbox.init({
    node: document.body
});

app.ports?.
    // @ts-expect-error Property 'incoming' does not exist on type 'never'.
    incoming;

Elm.Sandbox.init({
    // @ts-expect-error Object literal may only specify known properties, and 'flags' does not exist in type '{ node: Node; }'.
    flags: null,
    node: document.body
});
