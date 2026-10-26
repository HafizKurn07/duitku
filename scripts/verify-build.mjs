import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(projectRoot, "dist");

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function verify() {
  const html = await readFile(join(outputDir, "index.html"), "utf8");
  const serviceWorker = await readFile(join(outputDir, "sw.js"), "utf8");
  const manifest = JSON.parse(await readFile(join(outputDir, "manifest.webmanifest"), "utf8"));
  const vercelConfig = JSON.parse(await readFile(join(projectRoot, "vercel.json"), "utf8"));
  const appScriptMatch = html.match(/src="assets\/(app\.[a-f0-9]{8}\.js)"/);
  assert.ok(appScriptMatch, "HTML references a hashed application script");
  const appScript = await readFile(join(outputDir, "assets", appScriptMatch[1]), "utf8");

  assert.match(html, /assets\/app\.[a-f0-9]{8}\.css/, "HTML references a hashed stylesheet");
  assert.match(html, /assets\/app\.[a-f0-9]{8}\.js/, "HTML references a hashed script");
  assert.match(html, /assets\/finance\.[a-f0-9]{8}\.js/, "HTML references the finance module");
  assert.match(html, /assets\/wallets\.[a-f0-9]{8}\.js/, "HTML references the wallet module");
  assert.doesNotMatch(
    html,
    /assets\/app\.(?:css|js)(?:["'])/,
    "HTML contains no unbuilt asset references",
  );
  assert.doesNotMatch(
    serviceWorker,
    /__BUILD_VERSION__|__PRECACHE__/,
    "service worker placeholders are replaced",
  );
  assert.equal(
    await exists(join(outputDir, "tests")),
    false,
    "test files are not included in deploy output",
  );
  assert.equal(vercelConfig.installCommand, "npm ci", "Vercel uses the lockfile for installs");
  assert.equal(vercelConfig.buildCommand, "npm run build", "Vercel runs the project build");
  assert.equal(vercelConfig.outputDirectory, "dist", "Vercel serves generated static output");
  assert.ok(
    await exists(join(outputDir, "THIRD-PARTY-NOTICES.md")),
    "deployment includes third-party notices",
  );
  assert.ok(
    appScript.includes("DuitkuFinance.summarizeMonth"),
    "application uses the tested monthly calculation module",
  );
  assert.ok(
    appScript.includes("DuitkuFinance.monthlyBudgetRemaining"),
    "application uses target contributions in its monthly budget calculation",
  );
  assert.ok(
    appScript.includes("DuitkuFinance.summarizeYear"),
    "application uses the tested annual calculation module",
  );
  assert.ok(
    appScript.includes("DuitkuFinance.dailyExpenses"),
    "application uses the tested daily chart calculation",
  );
  assert.ok(
    appScript.includes("DuitkuFinance.weeklyExpenses"),
    "application uses the tested weekly chart calculation",
  );
  assert.ok(
    appScript.includes("DuitkuFinance.walletBalance"),
    "application uses the tested wallet calculation module",
  );
  assert.ok(
    appScript.includes("DuitkuFinance.saveTransaction"),
    "application uses the tested transaction save workflow",
  );
  assert.ok(
    appScript.includes("DuitkuFinance.removeTransaction"),
    "application uses the tested transaction delete workflow",
  );
  assert.ok(
    appScript.includes("DuitkuFinance.indexTransactions"),
    "application uses the transaction search index",
  );
  assert.ok(
    appScript.includes("DuitkuFinance.filterIndexedTransactions"),
    "application filters transactions through the search index",
  );
  assert.ok(
    appScript.includes("DuitkuBackup.readFile"),
    "application uses the tested backup reader",
  );
  assert.ok(
    appScript.includes("DuitkuBackup.exportJSON"),
    "application uses the tested JSON backup exporter",
  );
  assert.ok(
    appScript.includes("DuitkuWallets.normalize"),
    "application uses the tested wallet metadata normalizer",
  );

  const precacheMatch = serviceWorker.match(/const PRECACHE = (\[[^\n]*\]);/);
  assert.ok(precacheMatch, "service worker contains a generated precache list");
  const precache = JSON.parse(precacheMatch[1]);
  for (const asset of precache) {
    const relativePath = asset === "./" ? "index.html" : asset;
    assert.ok(await exists(join(outputDir, relativePath)), `precache asset exists: ${asset}`);
  }
  for (const license of [
    "THIRD-PARTY-NOTICES.md",
    "licenses/Apache-2.0.txt",
    "licenses/ISC.txt",
    "licenses/MIT.txt",
    "licenses/OFL-1.1.txt",
  ]) {
    assert.ok(precache.includes(license), `precache includes third-party license: ${license}`);
    assert.ok(await exists(join(outputDir, license)), `third-party notice exists: ${license}`);
  }

  for (const icon of manifest.icons) {
    assert.ok(await exists(join(outputDir, icon.src)), `manifest icon exists: ${icon.src}`);
  }

  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const reference = match[1];
    if (
      reference.startsWith("#") ||
      reference.includes("'") ||
      reference.includes('"') ||
      /^(?:data:|https?:|mailto:|tel:)/i.test(reference)
    )
      continue;
    const localPath = reference.split(/[?#]/, 1)[0];
    assert.ok(await exists(join(outputDir, localPath)), `HTML resource exists: ${reference}`);
  }

  console.log(`Verified build output at ${outputDir}.`);
}

verify().catch((error) => {
  console.error("Build verification failed:", error);
  process.exitCode = 1;
});
