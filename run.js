import fs from "fs";
import { doIt } from "./index.js";

const code = fs.readFileSync(process.stdin.fd, "utf-8");
const output = doIt(code);

process.stdout.write(output);
