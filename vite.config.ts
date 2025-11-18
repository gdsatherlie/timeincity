import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const alias: Record<string, string> = {};

try {
  require.resolve("@vercel/analytics/react");
} catch {
  alias["@vercel/analytics/react"] = path.resolve(__dirname, "src/shims/analyticsFallback.tsx");
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias
  }
});
