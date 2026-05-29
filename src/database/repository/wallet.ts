import { THEME } from "../../theme";
import { db } from "../config";

export type GetWallet = {
  id: number;
  name: string;
  balance: number;
  color?: string;
  icon?: string;
};

class WalletRepository {
  add(
    name: string,
    balance = 0,
    color = (THEME.colors.primary) as string,
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

  get():GetWallet[] {
    return db.getAllSync(`
        SELECT id, name, balance, icon, color
        FROM wallets
        where deleted_at is NULL
    `) as GetWallet[];
  }

  delete(){
    db.runSync(
      `DELETE FROM wallets`
    )
  }
}

export { WalletRepository };
