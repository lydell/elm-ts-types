// Generated file! Manual edits will be lost.
declare namespace Elm {
    namespace Application {
        export function init(args: {
            flags: string
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