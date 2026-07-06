// Generated file! Manual edits will be lost.
declare namespace Elm {
    namespace MultipleInputs {
        namespace A {
            export function init(args: {
                flags: string
            }): {
                ports: {
                    b_incoming: {
                        send: (value: string) => void
                    },
                    b_outgoing: {
                        subscribe: (f: (value: string) => Promise<void>) => void,
                        unsubscribe: (f: (value: string) => Promise<void>) => void
                    },
                    a_incoming: {
                        send: (value: string) => void
                    },
                    a_outgoing: {
                        subscribe: (f: (value: string) => Promise<void>) => void,
                        unsubscribe: (f: (value: string) => Promise<void>) => void
                    }
                }
            };
        }

        namespace B {
            export function init(args: {
                flags: string
            }): {
                ports: {
                    b_incoming: {
                        send: (value: string) => void
                    },
                    b_outgoing: {
                        subscribe: (f: (value: string) => Promise<void>) => void,
                        unsubscribe: (f: (value: string) => Promise<void>) => void
                    },
                    a_incoming: {
                        send: (value: string) => void
                    },
                    a_outgoing: {
                        subscribe: (f: (value: string) => Promise<void>) => void,
                        unsubscribe: (f: (value: string) => Promise<void>) => void
                    }
                }
            };
        }
    }
}