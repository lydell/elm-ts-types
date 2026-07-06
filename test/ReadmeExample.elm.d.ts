// Generated file! Manual edits will be lost.
declare namespace Elm {
    namespace ReadmeExample {
        export function init(args: {
            flags: { "text": string },
            node: Node
        }): {
            ports: {
                printFailed: {
                    send: (value: string) => void
                },
                print: {
                    subscribe: (f: (value: {
                        "pages": Array<string>,
                        "title": string
                    }) => Promise<void>) => void,
                    unsubscribe: (f: (value: {
                        "pages": Array<string>,
                        "title": string
                    }) => Promise<void>) => void
                }
            }
        };
    }
}