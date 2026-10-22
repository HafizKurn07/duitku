import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const moduleSource = await readFile(join(projectRoot, "src", "assets", "backup.js"), "utf8");
const sandbox = { Blob, URL, setTimeout, document: {} };
sandbox.globalThis = sandbox;
vm.runInNewContext(moduleSource, sandbox);
const backup = sandbox.DuitkuBackup;

const validState = {
  v: 2,
  name: "Duitku test",
  wallets: [{ id: "wallet-1" }],
  categories: [{ id: "category-1" }],
  transactions: [{ id: "transaction-1" }],
  budgets: {},
  targets: [{ id: "target-1", contribs: [{ id: "contribution-1" }] }],
};

function fakeFile(name, contents) {
  const text = typeof contents === "string" ? contents : JSON.stringify(contents);
  return {
    name,
    size: Buffer.byteLength(text),
    async text() {
      return text;
    },
    async arrayBuffer() {
      return new TextEncoder().encode(text).buffer;
    },
  };
}

test("exports a dated, versioned JSON backup containing app state", async () => {
  const { blob, filename } = backup.exportJSON(validState, new Date("2026-10-22T00:00:00.000Z"));
  const payload = JSON.parse(await blob.text());

  assert.equal(filename, "duitku-backup-2026-10-22.json");
  assert.equal(blob.type, "application/json");
  assert.equal(payload.format, "duitku-backup");
  assert.equal(payload.version, 1);
  assert.deepEqual(payload.data, validState);
});

test("reads and normalizes a valid JSON backup", async () => {
  let normalized;
  const result = await backup.readFile(
    fakeFile("backup.json", {
      format: "duitku-backup",
      version: 1,
      exportedAt: "2026-10-22T00:00:00.000Z",
      data: validState,
    }),
    {
      normalizeJson(state) {
        normalized = state;
        return { state, report: { transactions: state.transactions.length } };
      },
      readWorkbook() {
        assert.fail("JSON input should not be sent to the workbook parser");
      },
    },
  );

  assert.equal(normalized.name, validState.name);
  assert.equal(result.format, "JSON");
  assert.equal(result.report.transactions, 1);
  assert.equal(result.report.skipped, 0);
});

test("JSON backup round-trip preserves transfers between wallets and their fees", async () => {
  const state = {
    ...validState,
    transactions: [
      {
        id: "transfer-1",
        type: "transfer",
        amount: 250_000,
        feeAmount: 2_500,
        walletId: "wallet-1",
        toWalletId: "wallet-2",
        date: "2026-10-22",
        note: "Pindah dana",
        ts: 42,
      },
    ],
  };
  const exported = backup.exportJSON(state, new Date("2026-10-22T00:00:00.000Z"));
  const imported = await backup.readFile(
    fakeFile("transfer-backup.json", await exported.blob.text()),
    {
      normalizeJson: (input) => ({
        state: input,
        report: { transactions: input.transactions.length },
      }),
      readWorkbook: () => assert.fail("JSON input should not be sent to the workbook parser"),
    },
  );

  assert.deepEqual(
    JSON.parse(JSON.stringify(imported.state.transactions[0])),
    state.transactions[0],
  );
  assert.equal(imported.report.transactions, 1);
  assert.equal(imported.report.skipped, 0);
});

test("accepts legacy JSON app-state backups", async () => {
  const result = await backup.readFile(fakeFile("legacy.json", validState), {
    normalizeJson: (state) => ({ state, report: {} }),
    readWorkbook: () => assert.fail("JSON input should not be sent to the workbook parser"),
  });

  assert.equal(result.state.v, 2);
});

test("accepts older app-state backups without optional collections", async () => {
  const legacyState = { v: 1, transactions: [], wallets: [] };
  const result = await backup.readFile(fakeFile("older-backup.json", legacyState), {
    normalizeJson: (state) => ({ state, report: {} }),
    readWorkbook: () => assert.fail("JSON input should not be sent to the workbook parser"),
  });

  assert.equal(result.state.categories.length, 0);
  assert.equal(result.state.targets.length, 0);
  assert.equal(Object.keys(result.state.budgets).length, 0);
});

test("rejects malformed JSON and JSON without Duitku backup fields", async () => {
  const options = {
    normalizeJson: (state) => ({ state, report: {} }),
    readWorkbook: () => assert.fail("Invalid JSON input should not be sent to the workbook parser"),
  };

  await assert.rejects(backup.readFile(fakeFile("broken.json", "{"), options), {
    message: "FORMAT",
  });
  await assert.rejects(backup.readFile(fakeFile("other.json", { hello: "world" }), options), {
    message: "FORMAT",
  });
  await assert.rejects(
    backup.readFile(
      fakeFile("malformed-state.json", { transactions: [], wallets: "not-an-array" }),
      options,
    ),
    { message: "FORMAT" },
  );
});

test("rejects unsupported file types and files larger than 15 MB", async () => {
  const options = {
    normalizeJson: (state) => ({ state, report: {} }),
    readWorkbook: () => assert.fail("Unsupported file should not be read"),
  };

  await assert.rejects(backup.readFile(fakeFile("backup.csv", validState), options), {
    message: "FORMAT",
  });
  await assert.rejects(
    backup.readFile({ name: "backup.json", size: 15 * 1024 * 1024 + 1 }, options),
    { message: "BESAR" },
  );
});

test("routes Excel files through the workbook parser and reports the format", async () => {
  let receivedBuffer = false;
  const result = await backup.readFile(fakeFile("backup.xlsx", "workbook"), {
    normalizeJson: () => assert.fail("Excel input should not be sent to the JSON normalizer"),
    async readWorkbook(buffer) {
      receivedBuffer = buffer.byteLength > 0;
      return { state: validState, report: { transactions: 1 } };
    },
  });

  assert.equal(receivedBuffer, true);
  assert.equal(result.format, "Excel");
});

test("reports JSON rows skipped by state normalization", async () => {
  const state = {
    ...validState,
    transactions: [{ id: "valid" }, { id: "invalid" }],
    targets: [{ id: "target", contribs: [{ id: "valid" }, { id: "invalid" }] }],
  };
  const result = await backup.readFile(fakeFile("backup.json", state), {
    normalizeJson: (input) => ({
      state: {
        ...input,
        transactions: input.transactions.slice(0, 1),
        targets: [{ ...input.targets[0], contribs: input.targets[0].contribs.slice(0, 1) }],
      },
      report: {},
    }),
    readWorkbook: () => assert.fail("JSON input should not be sent to the workbook parser"),
  });

  assert.equal(result.report.skipped, 2);
});
