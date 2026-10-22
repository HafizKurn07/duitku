(function (root) {
  "use strict";

  const MAX_FILE_SIZE = 15 * 1024 * 1024;
  const JSON_BACKUP_FORMAT = "duitku-backup";
  const supportedExtensions = new Set(["json", "xls", "xlsx"]);

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function getBackupState(payload) {
    if (!isRecord(payload)) {
      throw new Error("FORMAT");
    }

    if (payload.format === JSON_BACKUP_FORMAT) {
      if (payload.version !== 1 || !isRecord(payload.data)) {
        throw new Error("FORMAT");
      }
      payload = payload.data;
    }

    if (!isRecord(payload) || !Array.isArray(payload.transactions)) {
      throw new Error("FORMAT");
    }

    const hasStateShape = ["wallets", "categories", "targets", "budgets"].some((key) =>
      Object.prototype.hasOwnProperty.call(payload, key),
    );
    if (
      !hasStateShape ||
      (payload.wallets !== undefined && !Array.isArray(payload.wallets)) ||
      (payload.categories !== undefined && !Array.isArray(payload.categories)) ||
      (payload.targets !== undefined && !Array.isArray(payload.targets)) ||
      (payload.budgets !== undefined && !isRecord(payload.budgets))
    ) {
      throw new Error("FORMAT");
    }

    return {
      ...payload,
      wallets: payload.wallets || [],
      categories: payload.categories || [],
      targets: payload.targets || [],
      budgets: payload.budgets || {},
    };
  }

  function countRecords(state) {
    return (
      state.transactions.length +
      state.targets.reduce(
        (total, target) =>
          total + (isRecord(target) && Array.isArray(target.contribs) ? target.contribs.length : 0),
        0,
      )
    );
  }

  function exportJSON(state, date = new Date()) {
    const backup = {
      format: JSON_BACKUP_FORMAT,
      version: 1,
      exportedAt: date.toISOString(),
      data: state,
    };
    const datePart = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    return {
      blob: new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }),
      filename: `duitku-backup-${datePart}.json`,
    };
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  async function readFile(file, { normalizeJson, readWorkbook }) {
    if (!file || typeof file.name !== "string" || !Number.isFinite(file.size)) {
      throw new Error("FORMAT");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("BESAR");
    }

    const extension = file.name.split(".").pop().toLowerCase();
    if (!supportedExtensions.has(extension)) {
      throw new Error("FORMAT");
    }

    if (extension !== "json") {
      const result = await readWorkbook(await file.arrayBuffer());
      return { ...result, format: "Excel" };
    }

    let payload;
    try {
      payload = JSON.parse(await file.text());
    } catch {
      throw new Error("FORMAT");
    }

    const backupState = getBackupState(payload);
    const result = normalizeJson(backupState);
    return {
      ...result,
      format: "JSON",
      report: {
        ...result.report,
        skipped: Math.max(0, countRecords(backupState) - countRecords(result.state)),
      },
    };
  }

  root.DuitkuBackup = { exportJSON, download, readFile };
})(globalThis);
