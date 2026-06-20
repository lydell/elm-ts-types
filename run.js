import fs from "fs";
import { generateTypeScript } from "./index.js";

process.stdout.write(generateTypeScript(fs.readFileSync("elm.js", "utf-8")));
