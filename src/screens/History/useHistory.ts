import { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import dayjs from "../../utils/dayjs";
import {
  GetTransaction,
  transactionRepo,
} from "../../database/repository/transaction";
import { FilterType, HistorySummary, TransactionGroup } from "./type";
import { PATHNAME } from "../../constants/pathname";

const PAGE_SIZE = 20;

export const useHistory = () => {
  const { t, i18n } = useTranslation("history");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation<AppNavigation>();

  const [filter, setFilter] = useState<FilterType>("all");
  const [transactions, setTransactions] = useState<GetTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [summary, setSummary] = useState<HistorySummary>({
    totalIncome: 0,
    totalExpense: 0,
    net: 0,
  });

  const loadData = useCallback(
    (targetPage: number, targetFilter: FilterType, isRefresh = false) => {
      try {
        const res = transactionRepo.gets({
          type: targetFilter === "all" ? "all" : targetFilter,
          page: targetPage,
          pageSize: PAGE_SIZE,
          sortBy: "transaction_date",
          sortOrder: "DESC",
        });

        if (isRefresh || targetPage === 1) {
          setTransactions(res);
        } else {
          setTransactions((prev) => {
            // Avoid duplicate IDs if any
            const existingIds = new Set(prev.map((item) => item.id));
            const newItems = res.filter((item) => !existingIds.has(item.id));
            return [...prev, ...newItems];
          });
        }

        setHasMore(res.length === PAGE_SIZE);

        const summaryData = transactionRepo.getSummary();
        setSummary({
          totalIncome: summaryData.totalIncome,
          totalExpense: summaryData.totalExpense,
          net: summaryData.totalIncome - summaryData.totalExpense,
        });
      } catch (error) {
        console.error("Failed to load history data:", error);
      }
    },
    [],
  );

  // Auto refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      loadData(1, filter, true);
    }, [filter, loadData]),
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(1);
    loadData(1, filter, true);
    setIsRefreshing(false);
  }, [filter, loadData]);

  const handleEndReached = useCallback(() => {
    if (!hasMore || isLoadingMore || isRefreshing) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage, filter, false);
    setIsLoadingMore(false);
  }, [hasMore, isLoadingMore, isRefreshing, page, filter, loadData]);

  const handleSelectFilter = useCallback(
    (newFilter: FilterType) => {
      if (newFilter === filter) return;
      setFilter(newFilter);
      setPage(1);
      setTransactions([]);
      loadData(1, newFilter, true);
    },
    [filter, loadData],
  );

  const handleTransactionPress = useCallback(
    (id: number) => {
      navigation.navigate("TransactionDetail", { id });
    },
    [navigation],
  );

  const handleAddTransaction = useCallback(() => {
    navigation.getParent()?.navigate(PATHNAME.TRANSACTION_ROOT);
  }, [navigation]);

  // Group transactions by date periods
  const groupedTransactions = useMemo(() => {
    const groupsMap = new Map<string, TransactionGroup>();
    const now = dayjs();
    const yesterday = dayjs().subtract(1, "day");

    transactions.forEach((tx) => {
      const txDate = tx.transactionDate ? dayjs(tx.transactionDate) : dayjs();
      let title = "";
      const dateKey = txDate.format("YYYY-MM-DD");

      if (txDate.isSame(now, "day")) {
        title = t("periods.today");
      } else if (txDate.isSame(yesterday, "day")) {
        title = t("periods.yesterday");
      } else if (txDate.isSame(now, "year")) {
        title = txDate.locale(i18n.language).format("dddd, D MMMM");
      } else {
        title = txDate.locale(i18n.language).format("D MMMM, YYYY");
      }

      if (!groupsMap.has(dateKey)) {
        groupsMap.set(dateKey, {
          title,
          dateKey,
          data: [],
          dayIncome: 0,
          dayExpense: 0,
        });
      }

      const group = groupsMap.get(dateKey)!;
      group.data.push(tx);
      if (tx.type === "income") {
        group.dayIncome += tx.amount;
      } else {
        group.dayExpense += tx.amount;
      }
    });

    return Array.from(groupsMap.values());
  }, [transactions, t, i18n.language]);

  return {
    t,
    tCommon,
    filter,
    transactions,
    groupedTransactions,
    hasMore,
    isRefreshing,
    isLoadingMore,
    summary,
    handleRefresh,
    handleEndReached,
    handleSelectFilter,
    handleTransactionPress,
    handleAddTransaction,
  };
};
