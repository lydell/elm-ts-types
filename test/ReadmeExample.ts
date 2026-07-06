const app = Elm.ReadmeExample.init({
    flags: { text: "" },
    node: document.createTextNode("")
});

function subscribeAll<Ports extends Record<string, any>>(
    ports: Ports,
    handlers: {
        [
            K in keyof Ports as Ports[K] extends {
                subscribe: (f: infer _) => void;
            }
                ? K
                : never
        ]:
            Ports[K] extends {
                subscribe: (f: infer F) => void;
            }
                ? F
                : never;
    }
): void {
    for (const key in handlers) {
        ports[key].subscribe(handlers[key]);
    }
}

subscribeAll(app.ports, {
    print: async ({ title, pages }) => {
        console.log(title, pages);
        if (pages.length > 100) {
            app.ports.printFailed.send("Too many pages.");
        }
    },
});

subscribeAll(
    app.ports,
    // @ts-expect-error Property 'print' is missing in type '{}' but required in type '{ print: (value: { pages: string[]; title: string; }) => Promise<void>; }'.
    {}
);

subscribeAll(
    app.ports,
    {
        // @ts-expect-error Object literal may only specify known properties, and 'other' does not exist in type '{ print: (value: { pages: string[]; title: string; }) => Promise<void>; }'.
        other:
            async () => {}
    }
);

window.Elm.ReadmeExample;
