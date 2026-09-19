import { IconName } from "../../assets/icons";
import { THEME } from "../../theme";
import { db } from "../config";

export type GetWallet = {
  id: number;
  name: string;
  balance: number;
  color?: string;
  icon?: IconName;
};

class WalletRepository {
  add(
    name: string,
    balance = 0,
    color = THEME.colors.primary as string,
    icon = "wallet-outline",
  ) {
    db.withTransactionSync(() => {
      db.runSync(
        `INSERT INTO wallets(name, balance, color, icon)
                VALUES(?,?,?,?)
                `,
        [name, balance, color, icon],
      );
    });
  }

  gets(): GetWallet[] {
    return db.getAllSync(`
        SELECT id, name, balance, icon, color
        FROM wallets
        where deleted_at is NULL
    `) as GetWallet[];
  }

  delete() {
    db.runSync(`DELETE FROM wallets`);
  }

  getById(id: number): GetWallet | null {
    try {
      const result = db.getFirstSync<GetWallet>(
        `
        SELECT id, name, balance, icon, color
        FROM wallets
        WHERE id = ? AND deleted_at IS NULL
        `,
        [id],
      );
      return result || null;
    } catch (error) {
      console.error("Failed to get wallet by id:", error);
      return null;
    }
  }

  update(
    id: number,
    data: {
      name?: string;
      balance?: number;
      color?: string;
      icon?: string;
    },
  ) {
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (data.name !== undefined) {
      fields.push("name = ?");
      values.push(data.name);
    }
    if (data.balance !== undefined) {
      fields.push("balance = ?");
      values.push(data.balance);
    }
    if (data.color !== undefined) {
      fields.push("color = ?");
      values.push(data.color);
    }
    if (data.icon !== undefined) {
      fields.push("icon = ?");
      values.push(data.icon);
    }

    if (fields.length === 0) return;

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    db.runSync(
      `UPDATE wallets SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  }

  deleteWithTransfer(walletIdToDelete: number): {
    success: boolean;
    targetWalletName: string;
    transferredAmount: number;
  } {
    const activeWallets = this.gets();
    if (activeWallets.length <= 1) {
      throw new Error("CANNOT_DELETE_LAST_WALLET");
    }

    const walletToDelete = activeWallets.find((w) => w.id === walletIdToDelete);
    if (!walletToDelete) {
      throw new Error("WALLET_NOT_FOUND");
    }

    // Find the first active wallet that is not the one being deleted
    const targetWallet = activeWallets.find((w) => w.id !== walletIdToDelete)!;

    db.withTransactionSync(() => {
      // 1. Transfer balance to target wallet
      if (walletToDelete.balance !== 0) {
        db.runSync(
          `UPDATE wallets SET balance = balance + ? WHERE id = ?`,
          [walletToDelete.balance, targetWallet.id],
        );
      }

      // 2. Re-assign all transactions of deleted wallet to target wallet
      db.runSync(
        `UPDATE transactions SET wallet_id = ? WHERE wallet_id = ?`,
        [targetWallet.id, walletToDelete.id],
      );

      // 3. Soft-delete the wallet
      db.runSync(
        `UPDATE wallets SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [walletToDelete.id],
      );
    });

    return {
      success: true,
      targetWalletName: targetWallet.name,
      transferredAmount: walletToDelete.balance,
    };
  }

  updateBalance(id: number, newBalance: number) {
    db.runSync(
      `UPDATE wallets
       SET balance = balance + ?
       WHERE id = ?`,
      [newBalance, id],
    );
  }
}

export const walletRepo = new WalletRepository();
