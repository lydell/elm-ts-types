import fs from "fs";
import { toSeparateDefinitions } from "./index.js";

const code = fs.readFileSync("elm.js", "utf-8");
const output = toSeparateDefinitions(code);

for (const [key, value] of Object.entries(output)) {
    console.log(key, value);
}
