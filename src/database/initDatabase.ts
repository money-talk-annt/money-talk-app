import { db } from "./config";

export const initDatabase = () => {
  const result = db.getFirstSync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  const currentVersion = result?.user_version ?? 0;

  // Ensure foreign key constraints are enforced
  db.execSync(`PRAGMA foreign_keys = ON;`);

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

    CREATE TRIGGER IF NOT EXISTS update_wallets_updated_at
    AFTER UPDATE ON wallets
    BEGIN
      UPDATE wallets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      note TEXT,
      transaction_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT DEFAULT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_wallet 
    ON transactions(wallet_id);

    CREATE TRIGGER IF NOT EXISTS update_transactions_updated_at
    AFTER UPDATE ON transactions
    BEGIN
      UPDATE transactions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);

  // Migration v2: Add image_uri column for Locket Mode
  if (currentVersion < 2) {
    try {
      db.execSync(
        `ALTER TABLE transactions ADD COLUMN image_uri TEXT DEFAULT NULL;`,
      );
    } catch {
      // Column may already exist if migration was partially applied
    }
  }

  db.execSync(`PRAGMA user_version = 2;`);
};
