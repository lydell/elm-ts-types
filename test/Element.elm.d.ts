// Generated file! Manual edits will be lost.
declare namespace Elm {
    namespace Element {
        export function init(args: {
            flags: string,
            node: Node
        }): {
            ports: {
                incoming: {
                    send: (value: string) => void
                },
                outgoing: {
                    subscribe: (f: (value: string) => Promise<void>) => void,
                    unsubscribe: (f: (value: string) => Promise<void>) => void
                }
            }
        };
    }
}