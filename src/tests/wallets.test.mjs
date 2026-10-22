import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const moduleSource = await readFile(join(projectRoot, "src", "assets", "wallets.js"), "utf8");
const sandbox = {};
sandbox.globalThis = sandbox;
vm.runInNewContext(moduleSource, sandbox);
const wallets = sandbox.DuitkuWallets;

test("wallet type presets contain only cash, bank, and e-wallet", () => {
  assert.deepEqual(
    Array.from(wallets.kinds, (kind) => kind.id),
    ["cash", "bank", "ewallet"],
  );
});

test("wallet normalization preserves wallet data and drops provider metadata", () => {
  assert.deepEqual(
    { ...wallets.normalize({ name: "DANA", kind: "ewallet", providerId: "dana" }) },
    { id: undefined, name: "DANA", emoji: undefined, kind: "ewallet", initial: undefined },
  );
  assert.equal(wallets.normalize({ name: "Tunai" }).kind, "cash");
  assert.equal(wallets.normalize({ name: "Bank" }).kind, "bank");
  assert.equal(wallets.normalize({ name: "E-Wallet" }).kind, "ewallet");
  const existing = wallets.normalize({
    id: "existing-wallet",
    name: "BCA Utama",
    emoji: "🏦",
    kind: "other",
    initial: 125_000,
    providerId: "bca",
  });
  assert.deepEqual(
    { ...existing },
    {
      id: "existing-wallet",
      name: "BCA Utama",
      emoji: "🏦",
      kind: "bank",
      initial: 125_000,
    },
  );
});
