import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const directory = path.resolve(projectRoot, process.argv[2] ?? "public");
const port = Number(process.argv[3] ?? (directory.endsWith("dist") ? 4173 : 5173));

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".ts": "application/typescript; charset=utf-8",
  ".tsx": "application/typescript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.statusCode = 400;
    res.end("Bad request");
    return;
  }

  const urlPath = req.url.split("?")[0];
  const safePath = path.normalize(urlPath).replace(/^\.\.(\\|\/)*/g, "");
  let filePath = path.join(directory, safePath);

  const serveFile = (targetPath) => {
    const ext = path.extname(targetPath);
    const contentType = mimeTypes[ext] ?? "application/octet-stream";
    const stream = fs.createReadStream(targetPath);
    stream.on("error", (err) => {
      console.error(err);
      res.statusCode = 500;
      res.end("Internal server error");
    });
    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    stream.pipe(res);
  };

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
      serveFile(filePath);
      return;
    }

    if (!err && stats.isFile()) {
      serveFile(filePath);
      return;
    }

    const fallback = path.join(directory, "index.html");
    fs.stat(fallback, (fallbackErr) => {
      if (fallbackErr) {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }
      serveFile(fallback);
    });
  });
});

server.listen(port, () => {
  console.log(`Serving ${directory} at http://localhost:${port}`);
});
