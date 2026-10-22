(function (root) {
  "use strict";

  function inferKind(name) {
    const normalized = String(name || "").toLowerCase();
    if (/tunai|cash/.test(normalized)) return "cash";
    if (/e.?wallet|dompet digital|dana|gopay|ovo|shopee/.test(normalized)) return "ewallet";
    return "bank";
  }

  function normalize(wallet) {
    const name = String(wallet.name || "Dompet");
    const kind = ["cash", "bank", "ewallet"].includes(wallet.kind) ? wallet.kind : inferKind(name);

    return {
      id: wallet.id,
      name,
      emoji: wallet.emoji,
      kind,
      initial: wallet.initial,
    };
  }

  root.DuitkuWallets = {
    kinds: [
      { id: "cash", name: "Tunai", mark: "Rp", color: "#16A37B" },
      { id: "bank", name: "Bank", mark: "BK", color: "#2866C5" },
      { id: "ewallet", name: "E-wallet", mark: "EW", color: "#7C5CFF" },
    ],
    inferKind,
    normalize,
  };
})(globalThis);
