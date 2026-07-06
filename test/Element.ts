const app = Elm.Element.init({
    flags: "",
    node: document.createComment("")
});

app.ports.incoming.send("");

app.ports.outgoing.subscribe(async (s) => {
    console.log(s.toUpperCase());
});
