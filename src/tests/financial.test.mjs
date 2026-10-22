import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const moduleSource = await readFile(join(projectRoot, "src", "assets", "finance.js"), "utf8");
const sandbox = {};
sandbox.globalThis = sandbox;
vm.runInNewContext(moduleSource, sandbox);
const finance = sandbox.DuitkuFinance;

function createState() {
  return {
    categories: [
      { id: "food", name: "Makan", emoji: "🍜", color: "#111111", type: "expense" },
      { id: "salary", name: "Gaji", emoji: "💼", color: "#222222", type: "income" },
    ],
    wallets: [
      { id: "cash", name: "Tunai", initial: 1_000_000 },
      { id: "bank", initial: 200_000 },
    ],
    transactions: [
      {
        id: "income-oct",
        type: "income",
        amount: 5_000_000,
        categoryId: "salary",
        walletId: "cash",
        date: "2026-10-01",
      },
      {
        id: "expense-oct-1",
        type: "expense",
        amount: 1_200_000,
        categoryId: "food",
        walletId: "cash",
        date: "2026-10-02",
      },
      {
        id: "expense-oct-2",
        type: "expense",
        amount: 800_000,
        categoryId: "food",
        walletId: "bank",
        date: "2026-10-10",
      },
      {
        id: "expense-oct-other",
        type: "expense",
        amount: 1_000_000,
        categoryId: "other",
        walletId: "bank",
        date: "2026-10-11",
      },
      {
        id: "income-sep",
        type: "income",
        amount: 900_000,
        categoryId: "salary",
        walletId: "bank",
        date: "2026-09-30",
      },
    ],
    targets: [
      {
        id: "emergency",
        contribs: [
          { id: "deposit-cash", type: "in", amount: 500_000, walletId: "cash", date: "2026-10-05" },
          {
            id: "withdraw-cash",
            type: "out",
            amount: 100_000,
            walletId: "cash",
            date: "2026-10-07",
          },
          { id: "deposit-outside", type: "in", amount: 200_000, walletId: "", date: "2026-09-01" },
        ],
      },
    ],
  };
}

test("monthly summary includes only matching month and signs target withdrawals", () => {
  const summary = finance.summarizeMonth(createState(), "2026-10");

  assert.deepEqual(
    { ...summary },
    {
      key: "2026-10",
      income: 5_000_000,
      expense: 3_000_000,
      net: 2_000_000,
      saved: 400_000,
      count: 4,
      rate: 0.4,
    },
  );
});

test("empty month has zero totals and no savings rate", () => {
  const summary = finance.summarizeMonth(createState(), "2026-08");

  assert.equal(summary.income, 0);
  assert.equal(summary.expense, 0);
  assert.equal(summary.net, 0);
  assert.equal(summary.saved, 0);
  assert.equal(summary.count, 0);
  assert.equal(summary.rate, null);
});

test("monthly summary reports a negative net when expenses exceed income", () => {
  const state = createState();
  state.transactions = [
    { type: "income", amount: 100, date: "2026-10-01" },
    { type: "expense", amount: 250, date: "2026-10-02" },
  ];

  const summary = finance.summarizeMonth(state, "2026-10");

  assert.equal(summary.net, -150);
  assert.equal(summary.rate, -1.5);
});

test("category breakdown groups, sorts, and calculates percentages by type and month", () => {
  const state = createState();
  const expenses = finance.categoryBreakdown(state, "2026-10");
  const income = finance.categoryBreakdown(state, "2026-10", "income");

  assert.deepEqual(
    JSON.parse(JSON.stringify(expenses.map(({ cat, total }) => ({ id: cat.id, total })))),
    [
      { id: "food", total: 2_000_000 },
      { id: "other", total: 1_000_000 },
    ],
  );
  assert.ok(Math.abs(expenses[0].pct - 200 / 3) < 1e-10);
  assert.ok(Math.abs(expenses[1].pct - 100 / 3) < 1e-10);
  assert.equal(income.length, 1);
  assert.equal(income[0].cat.id, "salary");
  assert.equal(income[0].pct, 100);
});

test("category breakdown assigns an unknown category to the existing fallback label", () => {
  const [category] = finance
    .categoryBreakdown(createState(), "2026-10")
    .filter((entry) => entry.cat.id === "other");

  assert.equal(category.cat.name, "Lainnya");
  assert.equal(category.cat.type, "expense");
});

test("wallet balance combines initial amount, transactions, and target cash movements", () => {
  const state = createState();

  assert.equal(finance.walletBalance(state, state.wallets[0]), 4_400_000);
  assert.equal(finance.walletBalance(state, state.wallets[1]), -700_000);
});

test("target saved amount subtracts withdrawals and can be negative", () => {
  assert.equal(
    finance.targetSaved({
      contribs: [
        { type: "in", amount: 100 },
        { type: "out", amount: 35 },
      ],
    }),
    65,
  );
  assert.equal(finance.targetSaved({ contribs: [{ type: "out", amount: 35 }] }), -35);
  assert.equal(finance.targetSaved({}), 0);
});

test("annual summary totals transactions and target movements for the selected year", () => {
  const summary = finance.summarizeYear(createState(), 2026);

  assert.equal(summary.months.length, 12);
  assert.deepEqual(
    { ...summary.totals },
    {
      income: 5_900_000,
      expense: 3_000_000,
      saved: 600_000,
      count: 5,
      net: 2_900_000,
      rate: 2_900_000 / 5_900_000,
    },
  );
  assert.equal(summary.activeMonths, 2);
  assert.equal(summary.avgIncome, 2_950_000);
  assert.equal(summary.avgExpense, 1_500_000);
  assert.equal(summary.avgSaved, 300_000);
  assert.equal(summary.maxValue, 5_000_000);
  assert.equal(summary.months[8].name, "September");
  assert.equal(summary.months[8].saved, 200_000);
  assert.equal(summary.months[9].saved, 400_000);
});

test("annual summary highlights spending, best savings rate, and deficit months", () => {
  const state = {
    transactions: [
      { type: "income", amount: 100, categoryId: "salary", walletId: "cash", date: "2026-01-01" },
      { type: "expense", amount: 150, categoryId: "food", walletId: "cash", date: "2026-01-02" },
      { type: "income", amount: 1_000, categoryId: "salary", walletId: "cash", date: "2026-02-01" },
      { type: "expense", amount: 200, categoryId: "food", walletId: "cash", date: "2026-02-02" },
    ],
    targets: [],
  };

  const summary = finance.summarizeYear(state, 2026);

  assert.equal(summary.topExpense.key, "2026-02");
  assert.equal(summary.lowExpense.key, "2026-01");
  assert.equal(summary.bestRate.key, "2026-02");
  assert.deepEqual(
    Array.from(summary.deficits, (month) => month.key),
    ["2026-01"],
  );
});

test("annual summary returns empty indicators and safe averages without data", () => {
  const summary = finance.summarizeYear({ transactions: [], targets: [] }, 2027);

  assert.equal(summary.activeMonths, 0);
  assert.equal(summary.avgIncome, 0);
  assert.equal(summary.avgExpense, 0);
  assert.equal(summary.avgSaved, 0);
  assert.equal(summary.maxValue, 1);
  assert.equal(summary.topExpense, null);
  assert.equal(summary.lowExpense, null);
  assert.equal(summary.bestRate, null);
  assert.equal(summary.deficits.length, 0);
});

test("daily chart includes every day of a leap-year February and identifies its peak", () => {
  const state = {
    transactions: [
      { type: "expense", amount: 30, date: "2024-02-29" },
      { type: "expense", amount: 20, date: "2024-02-29" },
      { type: "income", amount: 1_000, date: "2024-02-01" },
      { type: "expense", amount: 100, date: "2024-01-31" },
    ],
  };
  const result = finance.dailyExpenses(state, "2024-02");

  assert.equal(result.days.length, 29);
  assert.equal(result.days[28].total, 50);
  assert.equal(result.max, 50);
  assert.equal(result.top.day, 29);
  assert.equal(result.top.total, 50);
});

test("weekly chart uses the selected month end and scales bars from matching dates", () => {
  const state = {
    transactions: [
      { type: "expense", amount: 50, date: "2026-04-25" },
      { type: "expense", amount: 100, date: "2026-04-30" },
      { type: "expense", amount: 900, date: "2026-05-01" },
      { type: "income", amount: 2_000, date: "2026-04-29" },
    ],
  };
  const result = finance.weeklyExpenses(state, "2026-04", new Date(2026, 4, 22));

  assert.deepEqual(
    JSON.parse(
      JSON.stringify(result.map(({ key, total, h, isToday }) => ({ key, total, h, isToday }))),
    ),
    [
      { key: "2026-04-24", total: 0, h: 4, isToday: false },
      { key: "2026-04-25", total: 50, h: 50, isToday: false },
      { key: "2026-04-26", total: 0, h: 4, isToday: false },
      { key: "2026-04-27", total: 0, h: 4, isToday: false },
      { key: "2026-04-28", total: 0, h: 4, isToday: false },
      { key: "2026-04-29", total: 0, h: 4, isToday: false },
      { key: "2026-04-30", total: 100, h: 100, isToday: false },
    ],
  );
});

test("weekly chart anchors the current month to today", () => {
  const today = new Date(2026, 9, 22);
  const result = finance.weeklyExpenses(
    { transactions: [{ type: "expense", amount: 25, date: "2026-10-22" }] },
    "2026-10",
    today,
  );

  assert.equal(result.length, 7);
  assert.equal(result[6].key, "2026-10-22");
  assert.equal(result[6].isToday, true);
  assert.equal(result[6].total, 25);
});

test("top expenses sort by amount then newest date and honor the limit", () => {
  const state = {
    transactions: [
      { id: "old", type: "expense", amount: 100, date: "2026-10-01" },
      { id: "new", type: "expense", amount: 100, date: "2026-10-03" },
      { id: "large", type: "expense", amount: 200, date: "2026-10-02" },
      { id: "income", type: "income", amount: 900, date: "2026-10-04" },
      { id: "other-month", type: "expense", amount: 500, date: "2026-09-30" },
    ],
  };

  assert.deepEqual(
    Array.from(finance.topExpenses(state, "2026-10", 2), (transaction) => transaction.id),
    ["large", "new"],
  );
});

test("transaction search index matches notes, categories, transfer wallets, and type filters", () => {
  const state = createState();
  const transactions = [
    ...state.transactions.slice(0, 2),
    {
      id: "transfer",
      type: "transfer",
      amount: 100,
      walletId: "cash",
      toWalletId: "bank",
      date: "2026-10-12",
      note: "Pindah dana",
    },
  ];
  const index = finance.indexTransactions(transactions, state.categories, [
    { id: "cash", name: "Tunai" },
    { id: "bank", name: "Bank BCA" },
  ]);

  assert.deepEqual(
    Array.from(finance.filterIndexedTransactions(index, "  MAKAN "), (item) => item.id),
    ["expense-oct-1"],
  );
  assert.deepEqual(
    Array.from(finance.filterIndexedTransactions(index, "gaji", "income"), (item) => item.id),
    ["income-oct"],
  );
  assert.deepEqual(
    Array.from(finance.filterIndexedTransactions(index, "BCA", "transfer"), (item) => item.id),
    ["transfer"],
  );
  assert.deepEqual(
    Array.from(finance.filterIndexedTransactions(index, "pindah dana"), (item) => item.id),
    ["transfer"],
  );
  assert.deepEqual(
    Array.from(finance.filterIndexedTransactions(index, "", "expense"), (item) => item.id),
    ["expense-oct-1"],
  );
});

test("transaction creation validates fields and leaves existing transactions untouched on failure", () => {
  const existing = [{ id: "existing", amount: 10 }];
  const options = {
    createId: () => "generated-id",
    isValidDate: (date) => date === "2026-10-22",
    now: () => 123,
  };

  for (const [form, error] of [
    [
      { amount: "0", categoryId: "food", walletId: "cash", date: "2026-10-22" },
      "Isi nominalnya dulu ya.",
    ],
    [{ amount: "100", walletId: "cash", date: "2026-10-22" }, "Pilih kategori dulu."],
    [{ amount: "100", categoryId: "food", date: "2026-10-22" }, "Tambahkan dompet di Pengaturan."],
    [{ amount: "100", categoryId: "food", walletId: "cash", date: "invalid" }, "Pilih tanggal."],
  ]) {
    const result = finance.saveTransaction(existing, form, options);
    assert.equal(result.error, error);
    assert.equal(existing.length, 1);
  }

  const result = finance.saveTransaction(
    existing,
    {
      type: "expense",
      amount: "Rp 12.500",
      categoryId: "food",
      walletId: "cash",
      date: "2026-10-22",
      note: "  makan siang  ",
    },
    options,
  );

  assert.equal(result.transaction.id, "generated-id");
  assert.equal(result.transaction.amount, 12500);
  assert.equal(result.transaction.note, "makan siang");
  assert.equal(result.transaction.ts, 123);
  assert.equal(result.month, "2026-10");
  assert.equal(result.isEdit, false);
  assert.equal(existing.length, 1);
  assert.equal(result.transactions.length, 2);
});

test("transaction edit replaces only the matching record and preserves its identity and timestamp", () => {
  const transactions = [
    { id: "first", amount: 100 },
    { id: "second", amount: 200, ts: 42 },
  ];
  let generated = false;
  const result = finance.saveTransaction(
    transactions,
    {
      id: "second",
      type: "income",
      amount: "3.000",
      categoryId: "salary",
      walletId: "bank",
      date: "2026-09-30",
      note: "gaji",
      ts: 42,
    },
    {
      createId() {
        generated = true;
        return "unexpected";
      },
      isValidDate: () => true,
      now: () => 99,
    },
  );

  assert.equal(generated, false);
  assert.equal(result.isEdit, true);
  assert.equal(result.month, "2026-09");
  assert.equal(result.transactions.length, 2);
  assert.deepEqual(JSON.parse(JSON.stringify(result.transactions[1])), {
    id: "second",
    type: "income",
    amount: 3000,
    categoryId: "salary",
    walletId: "bank",
    date: "2026-09-30",
    note: "gaji",
    ts: 42,
  });
  assert.equal(transactions[1].amount, 200);
});

test("transaction deletion removes only the selected transaction", () => {
  const transactions = [
    { id: "first", amount: 100 },
    { id: "second", amount: 200 },
    { id: "third", amount: 300 },
  ];

  const remaining = finance.removeTransaction(transactions, "second");

  assert.deepEqual(
    Array.from(remaining, (transaction) => transaction.id),
    ["first", "third"],
  );
  assert.equal(transactions.length, 3);
  assert.equal(finance.removeTransaction(transactions, "missing").length, 3);
});

test("wallet transfers move balances without appearing as income or expense", () => {
  const state = {
    wallets: [
      { id: "cash", name: "Tunai", initial: 1_000 },
      { id: "dana", name: "DANA", initial: 200 },
    ],
    categories: [],
    transactions: [
      {
        id: "transfer",
        type: "transfer",
        amount: 300,
        feeAmount: 10,
        walletId: "cash",
        toWalletId: "dana",
        date: "2026-10-12",
      },
    ],
    targets: [],
  };

  assert.equal(finance.walletBalance(state, state.wallets[0]), 690);
  assert.equal(finance.walletBalance(state, state.wallets[1]), 500);
  assert.deepEqual(
    { ...finance.summarizeMonth(state, "2026-10") },
    {
      key: "2026-10",
      income: 0,
      expense: 10,
      net: -10,
      saved: 0,
      count: 1,
      rate: null,
    },
  );
  assert.equal(finance.categoryBreakdown(state, "2026-10")[0].cat.name, "Biaya transfer");
  assert.equal(finance.dailyExpenses(state, "2026-10").days[11].total, 10);
  assert.equal(finance.topExpenses(state, "2026-10")[0].amount, 10);
  const annual = finance.summarizeYear(state, 2026);
  assert.equal(annual.totals.expense, 10);
  assert.equal(annual.totals.count, 1);
});

test("daily and weekly reports include transfer fees but not transferred principal", () => {
  const state = {
    transactions: [
      {
        type: "transfer",
        amount: 100_000,
        feeAmount: 2_500,
        date: "2026-10-12",
      },
      { type: "income", amount: 50_000, date: "2026-10-12" },
      { type: "expense", amount: 10_000, date: "2026-10-13" },
    ],
    targets: [],
  };

  const summary = finance.summarizeRange(state, "2026-10-12", "2026-10-13");
  assert.equal(summary.income, 50_000);
  assert.equal(summary.expense, 12_500);
  assert.equal(summary.transfer, 100_000);
  assert.equal(summary.net, 37_500);
  assert.equal(summary.count, 3);
  assert.deepEqual(
    Array.from(finance.dailyRange(state, "2026-10-12", "2026-10-13"), (day) => [
      day.date,
      day.income,
      day.expense,
    ]),
    [
      ["2026-10-12", 50_000, 2_500],
      ["2026-10-13", 0, 10_000],
    ],
  );
  const weekly = finance.weeklyExpenses(state, "2026-10", new Date(2026, 9, 13));
  assert.equal(weekly.find((day) => day.key === "2026-10-12").total, 2_500);
  assert.equal(weekly.find((day) => day.key === "2026-10-13").total, 10_000);
});

test("transfer creation validates distinct wallets and keeps the admin fee", () => {
  const options = { createId: () => "transfer-id", isValidDate: () => true };
  const form = {
    type: "transfer",
    amount: "100.000",
    feeAmount: "2.500",
    walletId: "cash",
    toWalletId: "bank",
    date: "2026-10-12",
  };

  const result = finance.saveTransaction([], form, options);
  assert.equal(result.transaction.type, "transfer");
  assert.equal(result.transaction.amount, 100_000);
  assert.equal(result.transaction.feeAmount, 2_500);
  assert.equal(result.transaction.walletId, "cash");
  assert.equal(result.transaction.toWalletId, "bank");

  const invalid = finance.saveTransaction([], { ...form, toWalletId: "cash" }, options);
  assert.equal(invalid.error, "Dompet asal dan tujuan harus berbeda.");
});

test("editing a transfer preserves its ID and updates amount, wallets, date, and fee", () => {
  const original = {
    id: "transfer-id",
    type: "transfer",
    amount: 100_000,
    feeAmount: 2_500,
    walletId: "cash",
    toWalletId: "bank",
    date: "2026-10-12",
    note: "Pindah saldo",
    ts: 42,
  };
  const result = finance.saveTransaction(
    [original],
    {
      ...original,
      amount: "150.000",
      feeAmount: "5.000",
      walletId: "bank",
      toWalletId: "cash",
      date: "2026-11-01",
    },
    {
      createId: () => assert.fail("Editing must preserve the existing transaction ID"),
      isValidDate: (date) => date === "2026-11-01",
      now: () => 99,
    },
  );

  assert.equal(result.isEdit, true);
  assert.equal(result.month, "2026-11");
  assert.deepEqual(JSON.parse(JSON.stringify(result.transaction)), {
    id: "transfer-id",
    type: "transfer",
    amount: 150_000,
    feeAmount: 5_000,
    walletId: "bank",
    toWalletId: "cash",
    date: "2026-11-01",
    note: "Pindah saldo",
    ts: 42,
  });
  assert.equal(finance.removeTransaction([original], original.id).length, 0);
});

test("range reports include both selected dates and exclude neighboring days", () => {
  const summary = finance.summarizeRange(
    {
      transactions: [
        { type: "income", amount: 1_000, date: "2026-10-31" },
        { type: "expense", amount: 200, date: "2026-11-01" },
        { type: "income", amount: 9_000, date: "2026-11-02" },
      ],
      targets: [],
    },
    "2026-10-31",
    "2026-11-01",
  );

  assert.equal(summary.income, 1_000);
  assert.equal(summary.expense, 200);
  assert.equal(summary.net, 800);
  assert.equal(summary.count, 2);
});
