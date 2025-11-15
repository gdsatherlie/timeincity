import { cp, rm, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

await cp(path.join(projectRoot, "public"), distDir, { recursive: true });
await cp(path.join(projectRoot, "src"), path.join(distDir, "src"), { recursive: true });

console.log("Static files copied to dist/");
