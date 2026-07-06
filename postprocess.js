import fs from "node:fs";
import { generateTypeScript } from "./index.js";

export default function postprocess({ code, targetName }) {
    if (targetName === "ESM") {
        const typeDefinition = `// Generated file! Manual edits will be lost.
${generateTypeScript(code)}
// You only need one of these, but I test both in this repo.
export default Elm;
export const Elm: typeof Elm;`;

        fs.writeFileSync(`test/${targetName}.elm.d.ts`, typeDefinition);

        return `const output = {}; (function(){${code}}).call(output);
// You only need one of these, but I test both in this repo.
export default output.Elm;
export const Elm = output.Elm;`;
    }

    const typeDefinition = `// Generated file! Manual edits will be lost.
${generateTypeScript(code)}`;

    fs.writeFileSync(`test/${targetName}.elm.d.ts`, typeDefinition);

    return code;
}
