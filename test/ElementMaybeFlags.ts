const app = Elm.ElementMaybeFlags.init({
    flags: null,
    node: document.body
});

app.ports?.
    // @ts-expect-error Property 'incoming' does not exist on type 'never'.
    incoming;

Elm.ElementMaybeFlags.init({
    flags: 1,
    node: document.body
});
