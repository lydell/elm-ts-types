const app = Elm.Html_.init({ node: document.createElement("div") });

app.ports?.
    // @ts-expect-error Property 'incoming' does not exist on type 'never'.
    incoming;
