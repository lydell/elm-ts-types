const app = Elm.DocumentNoFlagsNoPorts.init();

app.ports?.
    // @ts-expect-error Property 'incoming' does not exist on type 'never'.
    incoming;

Elm.DocumentNoFlagsNoPorts.init(
    // @ts-expect-error Expected 0 arguments, but got 1.
    {}
);
