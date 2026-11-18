import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const project = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const root = process.argv.includes("--dist")
  ? path.join(project, "dist")
  : project;
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (
      pathname
        .split("/")
        .some((segment) => segment.startsWith(".") && segment !== ".nojekyll")
    )
      throw new Error("Not found");
    let target = path.resolve(root, "." + pathname);
    if (target !== root && !target.startsWith(root + path.sep))
      throw new Error("Not found");
    if ((await stat(target)).isDirectory())
      target = path.join(target, "index.html");
    const content = await readFile(target);
    response.writeHead(200, {
      "Content-Type": types[path.extname(target)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Página não encontrada.");
  }
});
server.listen(port, "0.0.0.0", () =>
  console.log(`Doctors: http://localhost:${port}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close(() => process.exit(0)));
