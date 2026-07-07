// Generated file! Manual edits will be lost.
declare namespace Elm {
    namespace DocumentJsonValue {
        export function init(args: {
            flags: unknown
        }): {
            ports: {
                incoming: {
                    send: (value: unknown) => void
                },
                outgoing: {
                    subscribe: (f: (value: unknown) => Promise<void>) => void,
                    unsubscribe: (f: (value: unknown) => Promise<void>) => void
                }
            }
        };
    }
}