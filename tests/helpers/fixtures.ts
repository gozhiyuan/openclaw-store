import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const FIXTURES_DIR = path.resolve(__dirname, "../fixtures");
export const TEMPLATES_DIR = path.resolve(__dirname, "../../templates");
export const PACKS_DIR    = path.resolve(__dirname, "../../packs");
