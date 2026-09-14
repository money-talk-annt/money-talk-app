import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { PATHNAME } from "../../constants/pathname";
import { GetWallet, walletRepo } from "../../database/repository/wallet";
import {
  GetTransaction,
  transactionRepo,
} from "../../database/repository/transaction";

const useDashboard = () => {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const [isExpense, setIsExpense] = useState(true);
  const navigation = useNavigation<AppNavigation>();
  const [wallets, setWallets] = useState<GetWallet[]>([]);
  const [transactions, setTransactions] = useState<GetTransaction[]>([]);

  const handlePressQuickAction = (value: boolean) => {
    return () => {
      if (value === isExpense) return;
      setIsExpense(value);
    };
  };

  const totalBalance = useMemo(
    () => wallets.reduce((acc, wallet) => acc + wallet.balance, 0),
    [wallets],
  );

  useFocusEffect(
    useCallback(() => {
      const walletRes = walletRepo.gets();
      setWallets(walletRes);
    }, [walletRepo]),
  );

  useFocusEffect(
    useCallback(() => {
      const transactionRes = transactionRepo.gets({
        type: isExpense ? "expense" : "income",
        page: 1,
        pageSize: 5,
      });
      setTransactions(transactionRes);
    }, [transactionRepo, isExpense]),
  );

  const handleNavigateToHistory = () => {
    navigation.navigate(PATHNAME.HISTORY);
  };

  const handleClickTransaction = (id: number) => {
    navigation.navigate("TransactionDetail", { id });
  };

  return {
    t,
    tCommon,
    isExpense,
    wallets,
    transactions,
    totalBalance,
    handlePressQuickAction,
    handleNavigateToHistory,
    handleClickTransaction,
  };
};

export { useDashboard };
