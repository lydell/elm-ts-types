// Generated file! Manual edits will be lost.
declare namespace Elm {
    namespace ESM {
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
// You only need one of these, but I test both in this repo.
export default Elm;
export const Elm: typeof Elm;