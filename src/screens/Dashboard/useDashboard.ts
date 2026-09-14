import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { PATHNAME } from "../../constants/pathname";
import { GetWallet, walletRepo } from "../../database/repository/wallet";
import {
  GetTransaction,
  transactionRepo,
} from "../../database/repository/transaction";
import dayjs from "../../utils/dayjs";

export type RecentFilterType = "all" | "expense" | "income";

const useDashboard = () => {
  const { t, i18n } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation<AppNavigation>();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [recentFilter, setRecentFilter] = useState<RecentFilterType>("all");
  const [wallets, setWallets] = useState<GetWallet[]>([]);
  const [transactions, setTransactions] = useState<GetTransaction[]>([]);
  const [monthCashflow, setMonthCashflow] = useState<{
    income: number;
    expense: number;
  }>({ income: 0, expense: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleBalanceVisibility = useCallback(() => {
    setIsBalanceVisible((prev) => !prev);
  }, []);

  const totalBalance = useMemo(
    () => wallets.reduce((acc, wallet) => acc + wallet.balance, 0),
    [wallets],
  );

  const loadData = useCallback(() => {
    // 1. Wallets
    const walletRes = walletRepo.gets();
    setWallets(walletRes);

    // 2. Month Cashflow
    const currentMonthPrefix = dayjs().format("YYYY-MM");
    const summary = transactionRepo.getSummary({
      datePrefix: currentMonthPrefix,
    });
    setMonthCashflow({
      income: summary.totalIncome || 0,
      expense: summary.totalExpense || 0,
    });

    // 3. Recent Transactions
    const transactionRes = transactionRepo.gets({
      type: recentFilter === "all" ? "all" : recentFilter,
      page: 1,
      pageSize: 6,
    });
    setTransactions(transactionRes);
  }, [recentFilter]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    try {
      loadData();
    } finally {
      setIsRefreshing(false);
    }
  }, [loadData]);

  const handleOpenAddTransaction = useCallback(
    (_type?: "income" | "expense") => {
      const parentNav = navigation.getParent();
      if (parentNav) {
        (parentNav as any).navigate(PATHNAME.TRANSACTION_ROOT);
      } else {
        (navigation as any).navigate(PATHNAME.TRANSACTION_ROOT);
      }
    },
    [navigation],
  );

  const handleNavigateToWallets = useCallback(() => {
    (navigation as any).navigate("Profile", { screen: "Wallet" });
  }, [navigation]);

  const handleNavigateToAddWallet = useCallback(() => {
    (navigation as any).navigate("Profile", { screen: "AddWallet" });
  }, [navigation]);

  const handleNavigateToHistory = useCallback(() => {
    navigation.navigate(PATHNAME.HISTORY);
  }, [navigation]);

  const handleClickTransaction = useCallback(
    (id: number) => {
      (navigation as any).navigate("TransactionDetail", { id });
    },
    [navigation],
  );

  const formattedDate = useMemo(() => {
    const isVi = i18n.language?.startsWith("vi");
    const formatted = dayjs()
      .locale(isVi ? "vi" : "en")
      .format(isVi ? "dddd, DD [tháng] MM" : "dddd, MMM DD");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, [i18n.language]);

  return {
    t,
    tCommon,
    wallets,
    transactions,
    totalBalance,
    isBalanceVisible,
    toggleBalanceVisibility,
    recentFilter,
    setRecentFilter,
    monthCashflow,
    isRefreshing,
    handleRefresh,
    handleOpenAddTransaction,
    handleNavigateToWallets,
    handleNavigateToAddWallet,
    handleNavigateToHistory,
    handleClickTransaction,
    formattedDate,
  };
};

export { useDashboard };
