import ElmDefault, { Elm } from "./ESM.elm.js";

const app1 = ElmDefault.ESM.init({ flags: "" });
const app2 = Elm.ESM.init({ flags: "" });

app1.ports.incoming.send("");
app2.ports.incoming.send("");

app1.ports.outgoing.subscribe(async (s) => { console.log(s.toUpperCase()); });
app2.ports.outgoing.subscribe(async (s) => { console.log(s.toUpperCase()); });
