import { cp, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
execFileSync(
  process.execPath,
  ["--check", path.join(root, "assets/js/main.js")],
  { stdio: "inherit" },
);
const html = await readFile(path.join(root, "index.html"), "utf8");
for (const match of html.matchAll(/(?:src|href)="(\.\/assets\/[^"#]+)"/g)) {
  await stat(path.resolve(root, match[1]));
}
await mkdir(output, { recursive: true });
for (const name of ["index.html", "assets", "robots.txt"]) {
  await cp(path.join(root, name), path.join(output, name), { recursive: true });
}
// GitHub browser uploads may omit dotfiles; generate the Pages marker in the output.
await writeFile(path.join(output, ".nojekyll"), "");

async function sizeOf(directory) {
  let bytes = 0;
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const location = path.join(directory, item.name);
    bytes += item.isDirectory()
      ? await sizeOf(location)
      : (await stat(location)).size;
  }
  return bytes;
}
console.log(
  `Build concluído: dist/ — ${((await sizeOf(output)) / 1024).toFixed(0)} KB. Sem dependências de produção.`,
);
