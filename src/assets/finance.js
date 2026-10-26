(function (root) {
  "use strict";

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const weekLabels = ["M", "S", "S", "R", "K", "J", "S"];
  const transferFeeCategory = {
    id: "transfer-fee",
    name: "Biaya transfer",
    emoji: "↔",
    color: "#8B7CFF",
    type: "expense",
  };

  function targetMovements(state) {
    return (state.targets || []).flatMap((target) =>
      (target.contribs || []).map((contribution) => ({
        id: contribution.id,
        type: contribution.type === "in" ? "expense" : "income",
        amount: contribution.amount,
        date: contribution.date,
        categoryId: `target:${target.id}`,
        targetId: target.id,
        targetName: target.name,
        targetEmoji: target.emoji,
        targetColor: target.color,
        walletId: contribution.walletId,
        note: contribution.note,
        isTargetContribution: true,
      })),
    );
  }

  function summarizeMonth(state, month) {
    let income = 0;
    let expense = 0;
    let saved = 0;
    let count = 0;

    for (const transaction of state.transactions) {
      if (!transaction.date.startsWith(month)) continue;
      if (transaction.type === "income") {
        income += transaction.amount;
        count += 1;
      } else if (transaction.type === "expense") {
        expense += transaction.amount;
        count += 1;
      } else if (transaction.type === "transfer") {
        expense += Number(transaction.feeAmount) || 0;
        count += 1;
      }
    }

    for (const movement of targetMovements(state)) {
      if (!movement.date.startsWith(month)) continue;
      if (movement.type === "expense") expense += movement.amount;
      else income += movement.amount;
      saved += movement.type === "expense" ? movement.amount : -movement.amount;
      count += 1;
    }

    const net = income - expense;
    return {
      key: month,
      income,
      expense,
      net,
      saved,
      count,
      rate: income > 0 ? net / income : null,
    };
  }

  function monthlyBudgetRemaining(state, month, limit, spent) {
    return (Number(limit) || 0) - (Number(spent) || 0) - summarizeMonth(state, month).saved;
  }

  function categoryBreakdown(state, month, type = "expense") {
    const categories = new Map((state.categories || []).map((category) => [category.id, category]));
    const targetCategories = new Map(
      (state.targets || []).map((target) => [
        `target:${target.id}`,
        {
          id: `target:${target.id}`,
          name: target.name || "Target tabungan",
          emoji: target.emoji || "🎯",
          color: target.color || "#8B7CFF",
          type,
        },
      ]),
    );
    const totals = new Map();
    let monthTotal = 0;

    for (const transaction of state.transactions) {
      if (!transaction.date.startsWith(month)) continue;
      const isTransferFee =
        transaction.type === "transfer" && Number(transaction.feeAmount) > 0 && type === "expense";
      if (isTransferFee) {
        totals.set(
          transferFeeCategory.id,
          (totals.get(transferFeeCategory.id) || 0) + transaction.feeAmount,
        );
        monthTotal += transaction.feeAmount;
        continue;
      }
      if (transaction.type !== type || transaction.type === "transfer") continue;
      totals.set(
        transaction.categoryId,
        (totals.get(transaction.categoryId) || 0) + transaction.amount,
      );
      monthTotal += transaction.amount;
    }

    for (const movement of targetMovements(state)) {
      if (movement.type !== type || !movement.date.startsWith(month)) continue;
      totals.set(movement.categoryId, (totals.get(movement.categoryId) || 0) + movement.amount);
      monthTotal += movement.amount;
    }

    return [...totals.entries()]
      .map(([categoryId, total]) => ({
        cat:
          categoryId === transferFeeCategory.id
            ? transferFeeCategory
            : targetCategories.get(categoryId) ||
              categories.get(categoryId) || {
                id: categoryId,
                name: "Lainnya",
                emoji: "✨",
                color: "#94A3B8",
                type,
              },
        total,
        pct: monthTotal ? (total / monthTotal) * 100 : 0,
      }))
      .sort((left, right) => right.total - left.total);
  }

  function targetSaved(target) {
    return (target.contribs || []).reduce(
      (total, contribution) =>
        total + (contribution.type === "out" ? -contribution.amount : contribution.amount),
      0,
    );
  }

  function walletBalance(state, wallet) {
    const transactions = state.transactions.reduce((total, transaction) => {
      if (transaction.type === "transfer") {
        if (transaction.walletId === wallet.id) {
          return total - transaction.amount - (Number(transaction.feeAmount) || 0);
        }
        if (transaction.toWalletId === wallet.id) return total + transaction.amount;
        return total;
      }
      return transaction.walletId === wallet.id
        ? total + (transaction.type === "income" ? transaction.amount : -transaction.amount)
        : total;
    }, 0);

    const contributions = state.targets.reduce(
      (total, target) =>
        total +
        (target.contribs || []).reduce(
          (walletTotal, contribution) =>
            contribution.walletId === wallet.id
              ? walletTotal +
                (contribution.type === "in" ? -contribution.amount : contribution.amount)
              : walletTotal,
          0,
        ),
      0,
    );

    return (Number(wallet.initial) || 0) + transactions + contributions;
  }

  function summarizeYear(state, year) {
    const months = Array.from({ length: 12 }, (_, index) => ({
      key: `${year}-${String(index + 1).padStart(2, "0")}`,
      index,
      label: monthLabels[index],
      name: monthNames[index],
      income: 0,
      expense: 0,
      saved: 0,
      count: 0,
    }));
    const yearPrefix = `${year}-`;

    for (const transaction of state.transactions) {
      if (!transaction.date.startsWith(yearPrefix)) continue;
      const month = months[Number(transaction.date.slice(5, 7)) - 1];
      if (!month) continue;
      if (transaction.type === "income") month.income += transaction.amount;
      else if (transaction.type === "expense") month.expense += transaction.amount;
      else if (transaction.type === "transfer") month.expense += Number(transaction.feeAmount) || 0;
      month.count += 1;
    }

    for (const movement of targetMovements(state)) {
      if (!movement.date.startsWith(yearPrefix)) continue;
      const month = months[Number(movement.date.slice(5, 7)) - 1];
      if (!month) continue;
      if (movement.type === "expense") {
        month.expense += movement.amount;
        month.saved += movement.amount;
      } else {
        month.income += movement.amount;
        month.saved -= movement.amount;
      }
      month.count += 1;
    }

    for (const month of months) {
      month.net = month.income - month.expense;
      month.rate = month.income > 0 ? month.net / month.income : null;
      month.active = month.count > 0 || month.expense > 0 || month.saved !== 0;
    }

    const totals = months.reduce(
      (sum, month) => ({
        income: sum.income + month.income,
        expense: sum.expense + month.expense,
        saved: sum.saved + month.saved,
        count: sum.count + month.count,
      }),
      { income: 0, expense: 0, saved: 0, count: 0 },
    );
    totals.net = totals.income - totals.expense;
    totals.rate = totals.income > 0 ? totals.net / totals.income : null;

    const activeMonths = months.filter((month) => month.active);
    const activeMonthCount = Math.max(1, activeMonths.length);
    const selectMonth = (items, value, compare) =>
      items.reduce(
        (selected, item) =>
          selected === null || compare(item[value], selected[value]) ? item : selected,
        null,
      );
    const spendingMonths = activeMonths.filter((month) => month.expense > 0);
    const rateMonths = activeMonths.filter((month) => month.rate !== null);

    return {
      year,
      months,
      totals,
      activeMonths: activeMonths.length,
      avgIncome: totals.income / activeMonthCount,
      avgExpense: totals.expense / activeMonthCount,
      avgSaved: totals.saved / activeMonthCount,
      avgNet: totals.net / activeMonthCount,
      maxValue: Math.max(1, ...months.flatMap((month) => [month.income, month.expense])),
      topExpense: selectMonth(spendingMonths, "expense", (left, right) => left > right),
      lowExpense: selectMonth(spendingMonths, "expense", (left, right) => left < right),
      bestRate: selectMonth(rateMonths, "rate", (left, right) => left > right),
      deficits: activeMonths.filter((month) => month.net < 0),
    };
  }

  function daysInMonth(month) {
    const [year, monthNumber] = month.split("-").map(Number);
    return new Date(year, monthNumber, 0).getDate();
  }

  function dailyExpenses(state, month) {
    const days = Array.from({ length: daysInMonth(month) }, (_, index) => ({
      day: index + 1,
      total: 0,
    }));

    for (const transaction of state.transactions) {
      if (!transaction.date.startsWith(month)) continue;
      const amount =
        transaction.type === "transfer"
          ? Number(transaction.feeAmount) || 0
          : transaction.type === "expense"
            ? transaction.amount
            : 0;
      if (!amount) continue;
      const dayIndex = Number(transaction.date.slice(8, 10)) - 1;
      if (days[dayIndex]) days[dayIndex].total += amount;
    }

    for (const movement of targetMovements(state)) {
      if (movement.type !== "expense" || !movement.date.startsWith(month)) continue;
      const dayIndex = Number(movement.date.slice(8, 10)) - 1;
      if (days[dayIndex]) days[dayIndex].total += movement.amount;
    }

    const top = days.reduce(
      (selected, day) =>
        day.total > 0 && (!selected || day.total > selected.total) ? day : selected,
      null,
    );
    return {
      days,
      max: Math.max(1, ...days.map((day) => day.total)),
      top,
    };
  }

  function weeklyExpenses(state, month, today = new Date()) {
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const lastDay =
      month === currentMonth
        ? today
        : new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0);
    const totalsByDate = new Map();

    for (const transaction of state.transactions) {
      const amount =
        transaction.type === "transfer"
          ? Number(transaction.feeAmount) || 0
          : transaction.type === "expense"
            ? transaction.amount
            : 0;
      if (!amount) continue;
      totalsByDate.set(transaction.date, (totalsByDate.get(transaction.date) || 0) + amount);
    }

    for (const movement of targetMovements(state)) {
      if (movement.type !== "expense") continue;
      totalsByDate.set(movement.date, (totalsByDate.get(movement.date) || 0) + movement.amount);
    }

    const days = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate() - offset);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      days.push({
        key,
        total: totalsByDate.get(key) || 0,
        label: weekLabels[date.getDay()],
        isToday:
          key ===
          `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
      });
    }

    const max = Math.max(1, ...days.map((day) => day.total));
    return days.map((day) => ({ ...day, h: Math.max(4, (day.total / max) * 100) }));
  }

  function topExpenses(state, month, limit = 5) {
    const transactions = state.transactions
      .filter(
        (transaction) =>
          (transaction.type === "expense" ||
            (transaction.type === "transfer" && Number(transaction.feeAmount) > 0)) &&
          transaction.date.startsWith(month),
      )
      .map((transaction) =>
        transaction.type === "transfer"
          ? {
              ...transaction,
              amount: transaction.feeAmount,
              categoryId: transferFeeCategory.id,
              expenseNote: transaction.note || "Biaya transfer",
              type: "expense",
              isTransferFee: true,
            }
          : transaction,
      );
    const contributions = targetMovements(state)
      .filter((movement) => movement.type === "expense" && movement.date.startsWith(month))
      .map((movement) => ({
        ...movement,
        expenseNote: movement.note || `Setoran ${movement.targetName || "target tabungan"}`,
      }));

    return [...transactions, ...contributions]
      .sort((left, right) => right.amount - left.amount || right.date.localeCompare(left.date))
      .slice(0, limit);
  }

  function indexTransactions(transactions, categories, wallets) {
    const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
    const walletNames = new Map(wallets.map((wallet) => [wallet.id, wallet.name]));

    return transactions.map((transaction) => {
      const relatedNames =
        transaction.type === "transfer"
          ? [
              walletNames.get(transaction.walletId) || "-",
              walletNames.get(transaction.toWalletId) || "-",
            ]
          : [categoryNames.get(transaction.categoryId) || "Lainnya"];
      return {
        transaction,
        searchText: [transaction.note, ...relatedNames].filter(Boolean).join(" ").toLowerCase(),
      };
    });
  }

  function filterIndexedTransactions(index, query, type = "all") {
    const normalizedQuery = String(query || "")
      .trim()
      .toLowerCase();
    return index
      .filter(
        ({ transaction, searchText }) =>
          (type === "all" || transaction.type === type) &&
          (!normalizedQuery || searchText.includes(normalizedQuery)),
      )
      .map(({ transaction }) => transaction);
  }

  function saveTransaction(transactions, form, { createId, isValidDate, now = Date.now }) {
    const amount = Number(String(form.amount).replace(/\D/g, ""));
    if (!amount) return { error: "Isi nominalnya dulu ya." };
    if (!form.walletId) return { error: "Tambahkan dompet di Pengaturan." };
    if (!isValidDate(form.date)) return { error: "Pilih tanggal." };

    let transaction;
    if (form.type === "transfer") {
      if (!form.toWalletId) return { error: "Pilih dompet tujuan." };
      if (form.walletId === form.toWalletId) {
        return { error: "Dompet asal dan tujuan harus berbeda." };
      }
      transaction = {
        id: form.id || createId(),
        type: "transfer",
        amount,
        feeAmount: Number(String(form.feeAmount || "").replace(/\D/g, "")) || 0,
        walletId: form.walletId,
        toWalletId: form.toWalletId,
        date: form.date,
        note: (form.note || "").trim(),
        ts: form.ts || now(),
      };
    } else {
      if (!form.categoryId) return { error: "Pilih kategori dulu." };
      transaction = {
        id: form.id || createId(),
        type: form.type,
        amount,
        categoryId: form.categoryId,
        walletId: form.walletId,
        date: form.date,
        note: (form.note || "").trim(),
        ts: form.ts || now(),
      };
    }
    const index = transactions.findIndex((item) => item.id === transaction.id);
    const updatedTransactions = [...transactions];
    if (index >= 0) updatedTransactions.splice(index, 1, transaction);
    else updatedTransactions.push(transaction);

    return {
      transaction,
      transactions: updatedTransactions,
      month: transaction.date.slice(0, 7),
      isEdit: index >= 0,
    };
  }

  function summarizeRange(state, startDate, endDate) {
    const summary = {
      startDate,
      endDate,
      income: 0,
      expense: 0,
      transfer: 0,
      saved: 0,
      count: 0,
    };
    const isInRange = (date) => date >= startDate && date <= endDate;

    for (const transaction of state.transactions) {
      if (!isInRange(transaction.date)) continue;
      if (transaction.type === "income") {
        summary.income += transaction.amount;
        summary.count += 1;
      } else if (transaction.type === "expense") {
        summary.expense += transaction.amount;
        summary.count += 1;
      } else if (transaction.type === "transfer") {
        summary.transfer += transaction.amount;
        summary.expense += Number(transaction.feeAmount) || 0;
        summary.count += 1;
      }
    }

    for (const movement of targetMovements(state)) {
      if (!isInRange(movement.date)) continue;
      if (movement.type === "expense") {
        summary.expense += movement.amount;
        summary.saved += movement.amount;
      } else {
        summary.income += movement.amount;
        summary.saved -= movement.amount;
      }
      summary.count += 1;
    }

    summary.net = summary.income - summary.expense;
    summary.rate = summary.income > 0 ? summary.net / summary.income : null;
    return summary;
  }

  function dailyRange(state, startDate, endDate) {
    const days = [];
    const totals = new Map();
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
      const key = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, "0"),
        String(cursor.getDate()).padStart(2, "0"),
      ].join("-");
      totals.set(key, { date: key, income: 0, expense: 0 });
    }

    for (const transaction of state.transactions) {
      const day = totals.get(transaction.date);
      if (!day) continue;
      if (transaction.type === "income") day.income += transaction.amount;
      else if (transaction.type === "expense") day.expense += transaction.amount;
      else if (transaction.type === "transfer") day.expense += Number(transaction.feeAmount) || 0;
    }

    for (const movement of targetMovements(state)) {
      const day = totals.get(movement.date);
      if (!day) continue;
      day[movement.type] += movement.amount;
    }
    days.push(...totals.values());
    return days;
  }

  function removeTransaction(transactions, id) {
    return transactions.filter((transaction) => transaction.id !== id);
  }

  root.DuitkuFinance = {
    summarizeMonth,
    monthlyBudgetRemaining,
    categoryBreakdown,
    targetSaved,
    walletBalance,
    summarizeYear,
    summarizeRange,
    dailyRange,
    dailyExpenses,
    weeklyExpenses,
    topExpenses,
    indexTransactions,
    filterIndexedTransactions,
    saveTransaction,
    removeTransaction,
  };
})(globalThis);
