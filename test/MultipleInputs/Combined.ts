const appA = Elm.MultipleInputs.A.init({
    flags: ""
});

appA.ports.a_incoming.send("");
appA.ports.a_outgoing.subscribe(async (s) => { console.log(s.toUpperCase()); });

const appB = Elm.MultipleInputs.B.init({
    flags: ""
});

appB.ports.b_incoming.send("");
appB.ports.b_outgoing.subscribe(async (s) => { console.log(s.toUpperCase()); });

// It’s a bug in Elm that the ports leak among the apps compiled together.
// The type annotations inherit this bug:
appA.ports.b_incoming.send("");
appA.ports.b_outgoing.subscribe(async (s) => { console.log(s.toUpperCase()); });
appB.ports.a_incoming.send("");
appB.ports.a_outgoing.subscribe(async (s) => { console.log(s.toUpperCase()); });
