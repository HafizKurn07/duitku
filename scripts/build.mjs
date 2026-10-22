import { createHash } from "node:crypto";
import { cp, readdir, readFile, rename, rm, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(projectRoot, "src");
const outputDir = join(projectRoot, "dist");

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    }),
  );
  return nested.flat().sort();
}

async function copySource() {
  await mkdir(outputDir, { recursive: true });
  for (const sourcePath of await deployFiles()) {
    const destinationPath = join(outputDir, relative(sourceDir, sourcePath));
    await mkdir(dirname(destinationPath), { recursive: true });
    await writeFile(destinationPath, await readFile(sourcePath));
  }
}

async function deployFiles() {
  return (await listFiles(sourceDir)).filter(
    (path) => relative(sourceDir, path).split(sep)[0] !== "tests",
  );
}

async function hashFile(path) {
  return createHash("sha256")
    .update(await readFile(path))
    .digest("hex");
}

function replaceExactlyOnce(input, search, replacement, description) {
  const first = input.indexOf(search);
  if (first === -1 || input.indexOf(search, first + search.length) !== -1) {
    throw new Error(`Expected exactly one ${description} reference in src/index.html.`);
  }
  return input.slice(0, first) + replacement + input.slice(first + search.length);
}

async function build() {
  const sourceFiles = await deployFiles();
  if (sourceFiles.length === 0) {
    throw new Error("Source directory is empty.");
  }

  await rm(outputDir, { recursive: true, force: true });
  await copySource();
  await cp(join(projectRoot, "THIRD-PARTY-NOTICES.md"), join(outputDir, "THIRD-PARTY-NOTICES.md"));
  await cp(join(projectRoot, "licenses"), join(outputDir, "licenses"), { recursive: true });

  const cssSource = join(outputDir, "assets", "app.css");
  const jsSource = join(outputDir, "assets", "app.js");
  const backupSource = join(outputDir, "assets", "backup.js");
  const financeSource = join(outputDir, "assets", "finance.js");
  const walletsSource = join(outputDir, "assets", "wallets.js");
  const cssHash = (await hashFile(cssSource)).slice(0, 8);
  const jsHash = (await hashFile(jsSource)).slice(0, 8);
  const backupHash = (await hashFile(backupSource)).slice(0, 8);
  const financeHash = (await hashFile(financeSource)).slice(0, 8);
  const walletsHash = (await hashFile(walletsSource)).slice(0, 8);
  const cssName = `app.${cssHash}.css`;
  const jsName = `app.${jsHash}.js`;
  const backupName = `backup.${backupHash}.js`;
  const financeName = `finance.${financeHash}.js`;
  const walletsName = `wallets.${walletsHash}.js`;
  await rename(cssSource, join(dirname(cssSource), cssName));
  await rename(jsSource, join(dirname(jsSource), jsName));
  await rename(backupSource, join(dirname(backupSource), backupName));
  await rename(financeSource, join(dirname(financeSource), financeName));
  await rename(walletsSource, join(dirname(walletsSource), walletsName));

  let html = await readFile(join(outputDir, "index.html"), "utf8");
  html = replaceExactlyOnce(html, "assets/app.css", `assets/${cssName}`, "stylesheet");
  html = replaceExactlyOnce(
    html,
    "assets/finance.js",
    `assets/${financeName}`,
    "finance module script",
  );
  html = replaceExactlyOnce(
    html,
    "assets/backup.js",
    `assets/${backupName}`,
    "backup module script",
  );
  html = replaceExactlyOnce(
    html,
    "assets/wallets.js",
    `assets/${walletsName}`,
    "wallet module script",
  );
  html = replaceExactlyOnce(html, "assets/app.js", `assets/${jsName}`, "script");
  await writeFile(join(outputDir, "index.html"), html);

  const versionHash = createHash("sha256");
  for (const sourcePath of sourceFiles) {
    versionHash.update(relative(sourceDir, sourcePath).split(sep).join("/"));
    versionHash.update(await readFile(sourcePath));
  }
  const version = versionHash.digest("hex").slice(0, 8);
  const precache = [
    "./",
    "index.html",
    `assets/${cssName}`,
    `assets/${financeName}`,
    `assets/${backupName}`,
    `assets/${jsName}`,
    `assets/${walletsName}`,
    "assets/fonts/plus-jakarta-sans-latin-wght-normal.woff2",
    "manifest.webmanifest",
    "favicon.svg",
    "icons/apple-touch-icon.png",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "icons/icon-maskable-512.png",
    "THIRD-PARTY-NOTICES.md",
    "licenses/Apache-2.0.txt",
    "licenses/ISC.txt",
    "licenses/MIT.txt",
    "licenses/OFL-1.1.txt",
  ];

  const serviceWorkerPath = join(outputDir, "sw.js");
  let serviceWorker = await readFile(serviceWorkerPath, "utf8");
  if (!serviceWorker.includes("'__BUILD_VERSION__'") || !serviceWorker.includes("__PRECACHE__")) {
    throw new Error("Service worker template is missing build placeholders.");
  }
  serviceWorker = serviceWorker
    .replace("'__BUILD_VERSION__'", JSON.stringify(version))
    .replace("__PRECACHE__", JSON.stringify(precache));
  await writeFile(serviceWorkerPath, serviceWorker);

  console.log(`Built Duitku ${version} to ${relative(projectRoot, outputDir)}.`);
  console.log(`Hashed assets: ${cssName}, ${jsName}`);
}

build().catch((error) => {
  console.error("Build failed:", error);
  process.exitCode = 1;
});
