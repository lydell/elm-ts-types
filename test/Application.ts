const app = Elm.Application.init({
    flags: ""
});

app.ports.incoming.send("");

app.ports.outgoing.subscribe(async (s) => {
    console.log(s.toUpperCase());
});
