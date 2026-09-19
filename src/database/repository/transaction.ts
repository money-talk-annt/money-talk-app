import { db } from "../config";

export type Transaction = {
  id: number;
  wallet_id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  note?: string;
  image_uri?: string;
  transaction_date?: string;
  created_at: string;
  updated_at: string;
};

export type GetTransaction = {
  id: number;
  wallet_id?: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  note?: string;
  image_uri?: string;
  transactionDate?: string;
  walletName?: string;
};

export type CreateTransactionInput = Omit<
  Transaction,
  "id" | "created_at" | "updated_at"
>;

class TransactionRepository {
  create(data: CreateTransactionInput) {
    try {
      const result = db.runSync(
        `
        INSERT INTO transactions (wallet_id, type, amount, category, note, transaction_date, image_uri)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          data.wallet_id,
          data.type,
          data.amount,
          data.category,
          data.note || null,
          data.transaction_date || null,
          data.image_uri || null,
        ],
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error("Failed to create transaction:", error);
      throw error;
    }
  }

  createWithWalletUpdate(data: CreateTransactionInput) {
    try {
      let lastId: number | undefined;
      const delta = data.type === "expense" ? -data.amount : data.amount;

      db.withTransactionSync(() => {
        const res = db.runSync(
          `
          INSERT INTO transactions (wallet_id, type, amount, category, note, transaction_date, image_uri)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            data.wallet_id,
            data.type,
            data.amount,
            data.category,
            data.note || null,
            data.transaction_date || null,
            data.image_uri || null,
          ],
        );

        lastId = res.lastInsertRowId;

        db.runSync(`UPDATE wallets SET balance = balance + ? WHERE id = ?`, [
          delta,
          data.wallet_id,
        ]);
      });

      return lastId;
    } catch (error) {
      console.error("Failed to create transaction with wallet update:", error);
      throw error;
    }
  }

  getAll(): Transaction[] {
    try {
      const result = db.getAllSync<Transaction>(
        `
        SELECT * FROM transactions
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        `,
      );
      return result;
    } catch (error) {
      console.error("Failed to get transactions:", error);
      return [];
    }
  }

  getByWallet(walletId: number): Transaction[] {
    try {
      const result = db.getAllSync<Transaction>(
        `
        SELECT * FROM transactions
        WHERE wallet_id = ? AND deleted_at IS NULL
        ORDER BY created_at DESC
        `,
        [walletId],
      );
      return result;
    } catch (error) {
      console.error("Failed to get transactions by wallet:", error);
      return [];
    }
  }

  getById(id: number): GetTransaction | null {
    try {
      const result = db.getFirstSync<GetTransaction>(
        `
        SELECT T.id AS id, T.wallet_id AS wallet_id, type, amount, category, note, T.image_uri AS image_uri,
        transaction_date AS transactionDate, 
        COALESCE(wallets.name, '') AS walletName
        FROM transactions T
        LEFT JOIN wallets ON T.wallet_id = wallets.id
        WHERE T.id = ? AND T.deleted_at IS NULL
        `,
        [id],
      );
      return result || null;
    } catch (error) {
      console.error("Failed to get transaction:", error);
      return null;
    }
  }

  update(id: number, data: Partial<CreateTransactionInput>) {
    try {
      const fields = [];
      const values = [];

      if (data.wallet_id !== undefined) {
        fields.push("wallet_id = ?");
        values.push(data.wallet_id);
      }
      if (data.type !== undefined) {
        fields.push("type = ?");
        values.push(data.type);
      }
      if (data.amount !== undefined) {
        fields.push("amount = ?");
        values.push(data.amount);
      }
      if (data.category !== undefined) {
        fields.push("category = ?");
        values.push(data.category);
      }
      if (data.note !== undefined) {
        fields.push("note = ?");
        values.push(data.note || null);
      }

      if (fields.length === 0) return;

      fields.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);

      db.runSync(
        `UPDATE transactions SET ${fields.join(", ")} WHERE id = ?`,
        values,
      );
    } catch (error) {
      console.error("Failed to update transaction:", error);
      throw error;
    }
  }

  updateWithWalletUpdate(id: number, data: CreateTransactionInput) {
    try {
      db.withTransactionSync(() => {
        const oldTx = db.getFirstSync<Transaction>(
          `SELECT * FROM transactions WHERE id = ? AND deleted_at IS NULL`,
          [id],
        );

        if (!oldTx) {
          throw new Error("Transaction not found");
        }

        // Old effect on oldTx.wallet_id:
        // If oldTx was expense, it deducted oldTx.amount (-oldTx.amount).
        // If oldTx was income, it added oldTx.amount (+oldTx.amount).
        const oldDelta = oldTx.type === "expense" ? -oldTx.amount : oldTx.amount;
        const newDelta = data.type === "expense" ? -data.amount : data.amount;

        if (oldTx.wallet_id === data.wallet_id) {
          // Same wallet: apply difference
          const diff = newDelta - oldDelta;
          if (diff !== 0) {
            db.runSync(`UPDATE wallets SET balance = balance + ? WHERE id = ?`, [
              diff,
              data.wallet_id,
            ]);
          }
        } else {
          // Changed wallet: revert from old wallet, apply to new wallet
          db.runSync(`UPDATE wallets SET balance = balance - ? WHERE id = ?`, [
            oldDelta,
            oldTx.wallet_id,
          ]);
          db.runSync(`UPDATE wallets SET balance = balance + ? WHERE id = ?`, [
            newDelta,
            data.wallet_id,
          ]);
        }

        db.runSync(
          `
          UPDATE transactions
          SET wallet_id = ?, type = ?, amount = ?, category = ?, note = ?, transaction_date = ?, image_uri = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
          `,
          [
            data.wallet_id,
            data.type,
            data.amount,
            data.category,
            data.note || null,
            data.transaction_date || null,
            data.image_uri || null,
            id,
          ],
        );
      });
    } catch (error) {
      console.error("Failed to update transaction with wallet update:", error);
      throw error;
    }
  }

  delete(id: number) {
    try {
      db.runSync(
        `
        UPDATE transactions 
        SET deleted_at = CURRENT_TIMESTAMP 
        WHERE id = ?
        `,
        [id],
      );
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      throw error;
    }
  }

  deleteWithWalletUpdate(id: number) {
    try {
      db.withTransactionSync(() => {
        const tx = db.getFirstSync<Transaction>(
          `SELECT * FROM transactions WHERE id = ? AND deleted_at IS NULL`,
          [id],
        );

        if (!tx) {
          return;
        }

        // Reverting the transaction:
        // If expense was -amount, deleting it refunds +amount.
        // If income was +amount, deleting it deducts -amount.
        const refundDelta = tx.type === "expense" ? tx.amount : -tx.amount;

        db.runSync(`UPDATE wallets SET balance = balance + ? WHERE id = ?`, [
          refundDelta,
          tx.wallet_id,
        ]);

        db.runSync(
          `UPDATE transactions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [id],
        );
      });
    } catch (error) {
      console.error("Failed to delete transaction with wallet update:", error);
      throw error;
    }
  }

  gets({
    walletId,
    type = "all",
    category,
    startTime,
    endTime,
    datePrefix,
    page = 1,
    pageSize = 20,
    sortBy = "transaction_date",
    sortOrder = "DESC",
  }: {
    walletId?: number;
    type?: "income" | "expense" | "all";
    category?: string;
    startTime?: Date;
    endTime?: Date;
    datePrefix?: string;
    page?: number;
    pageSize?: number;
    sortBy?: "transaction_date" | "amount";
    sortOrder?: "ASC" | "DESC";
  }): GetTransaction[] {
    const conditions: string[] = ["transactions.deleted_at IS NULL"];
    const params: (string | number)[] = [];

    if (walletId) {
      conditions.push("wallet_id = ?");
      params.push(walletId);
    }

    if (type !== "all") {
      conditions.push("type = ?");
      params.push(type);
    }

    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }

    if (datePrefix) {
      conditions.push(
        "SUBSTR(COALESCE(transactions.transaction_date, transactions.created_at), 1, ?) = ?",
      );
      params.push(datePrefix.length);
      params.push(datePrefix);
    }

    if (startTime) {
      conditions.push("transaction_date >= ?");
      params.push(startTime.toISOString());
    }

    if (endTime) {
      conditions.push("transaction_date <= ?");
      params.push(endTime.toISOString());
    }

    const offset = (page - 1) * pageSize;

    const orderExpr =
      sortBy === "transaction_date"
        ? "COALESCE(transactions.transaction_date, transactions.created_at)"
        : `transactions.${sortBy}`;

    const query = `
        SELECT transactions.id AS id, type, amount, category, note, transactions.image_uri AS image_uri,
        COALESCE(transactions.transaction_date, transactions.created_at) AS transactionDate, 
        COALESCE(wallets.name, '') AS walletName
        FROM transactions
        LEFT JOIN wallets ON transactions.wallet_id = wallets.id
        WHERE ${conditions.join(" AND ")}
        ORDER BY ${orderExpr} ${sortOrder}
        LIMIT ? OFFSET ?
    `;

    params.push(pageSize);
    params.push(offset);

    return db.getAllSync(query, params);
  }

  getSummary({
    walletId,
    startTime,
    endTime,
    datePrefix,
  }: {
    walletId?: number;
    startTime?: Date;
    endTime?: Date;
    datePrefix?: string;
  } = {}): { totalIncome: number; totalExpense: number } {
    const conditions: string[] = ["deleted_at IS NULL"];
    const params: (string | number)[] = [];

    if (walletId) {
      conditions.push("wallet_id = ?");
      params.push(walletId);
    }
    if (datePrefix) {
      conditions.push(
        "SUBSTR(COALESCE(transactions.transaction_date, transactions.created_at), 1, ?) = ?",
      );
      params.push(datePrefix.length);
      params.push(datePrefix);
    }
    if (startTime) {
      conditions.push("transaction_date >= ?");
      params.push(startTime.toISOString());
    }
    if (endTime) {
      conditions.push("transaction_date <= ?");
      params.push(endTime.toISOString());
    }

    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS totalIncome,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS totalExpense
      FROM transactions
      WHERE ${conditions.join(" AND ")}
    `;

    const result = db.getFirstSync<{
      totalIncome: number;
      totalExpense: number;
    }>(query, params);
    return result || { totalIncome: 0, totalExpense: 0 };
  }

  getDailySummaryByMonth(
    yearMonth: string,
  ): Record<string, { totalIncome: number; totalExpense: number }> {
    try {
      const query = `
        SELECT 
          SUBSTR(COALESCE(transactions.transaction_date, transactions.created_at), 1, 10) AS dateKey,
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS totalIncome,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS totalExpense
        FROM transactions
        WHERE transactions.deleted_at IS NULL
          AND SUBSTR(COALESCE(transactions.transaction_date, transactions.created_at), 1, 7) = ?
        GROUP BY dateKey
      `;

      const rows = db.getAllSync<{
        dateKey: string;
        totalIncome: number;
        totalExpense: number;
      }>(query, [yearMonth]);

      const result: Record<
        string,
        { totalIncome: number; totalExpense: number }
      > = {};
      rows.forEach((row) => {
        if (row.dateKey) {
          result[row.dateKey] = {
            totalIncome: row.totalIncome,
            totalExpense: row.totalExpense,
          };
        }
      });
      return result;
    } catch (error) {
      console.error("Failed to get daily summary by month:", error);
      return {};
    }
  }
  getLocketTransactions({
    page = 1,
    pageSize = 20,
    datePrefix,
  }: {
    page?: number;
    pageSize?: number;
    datePrefix?: string;
  } = {}): GetTransaction[] {
    const conditions: string[] = [
      "transactions.deleted_at IS NULL",
      "transactions.image_uri IS NOT NULL",
    ];
    const params: (string | number)[] = [];

    if (datePrefix) {
      conditions.push(
        "SUBSTR(COALESCE(transactions.transaction_date, transactions.created_at), 1, ?) = ?",
      );
      params.push(datePrefix.length);
      params.push(datePrefix);
    }

    const offset = (page - 1) * pageSize;

    const query = `
      SELECT transactions.id AS id, type, amount, category, note, transactions.image_uri AS image_uri,
      COALESCE(transactions.transaction_date, transactions.created_at) AS transactionDate,
      COALESCE(wallets.name, '') AS walletName
      FROM transactions
      LEFT JOIN wallets ON transactions.wallet_id = wallets.id
      WHERE ${conditions.join(" AND ")}
      ORDER BY COALESCE(transactions.transaction_date, transactions.created_at) DESC
      LIMIT ? OFFSET ?
    `;

    params.push(pageSize);
    params.push(offset);

    return db.getAllSync(query, params);
  }
}

export const transactionRepo = new TransactionRepository();
