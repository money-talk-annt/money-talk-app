import { db } from "./config";

export const initDatabase = () => {
  const result = db.getFirstSync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  const currentVersion = result?.user_version;

  if (currentVersion && currentVersion > 1) {
    return;
  }

  db.execSync(`
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      balance REAL DEFAULT 0,
      color TEXT,
      icon TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT DEFAULT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      note TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT DEFAULT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_wallet 
    ON transactions(wallet_id);
  `);
  db.execSync(`PRAGMA user_version = 1;`);
};
