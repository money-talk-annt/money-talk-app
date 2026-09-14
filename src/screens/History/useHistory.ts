import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Dayjs } from "dayjs";
import dayjs from "../../utils/dayjs";
import {
  GetTransaction,
  transactionRepo,
} from "../../database/repository/transaction";
import { DailySummary, FilterType, HistorySummary, TransactionGroup } from "./type";
import { PATHNAME } from "../../constants/pathname";

const PAGE_SIZE = 20;

export const useHistory = () => {
  const { t, i18n } = useTranslation("history");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation<AppNavigation>();

  const [filter, setFilter] = useState<FilterType>("all");
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs().startOf("month"));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(true);

  const [transactions, setTransactions] = useState<GetTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [dailySummaries, setDailySummaries] = useState<DailySummary>({});
  const [monthSummary, setMonthSummary] = useState<{ totalIncome: number; totalExpense: number }>({
    totalIncome: 0,
    totalExpense: 0,
  });

  const [overallSummary, setOverallSummary] = useState<HistorySummary>({
    totalIncome: 0,
    totalExpense: 0,
    net: 0,
  });

  // Calculate active date prefix for filtering
  const activeDatePrefix = useMemo(() => {
    if (selectedDate) return selectedDate;
    return currentMonth.format("YYYY-MM");
  }, [selectedDate, currentMonth]);

  const loadData = useCallback(
    (targetPage: number, targetFilter: FilterType, datePrefix: string, isRefresh = false) => {
      try {
        const res = transactionRepo.gets({
          type: targetFilter === "all" ? "all" : targetFilter,
          datePrefix,
          page: targetPage,
          pageSize: PAGE_SIZE,
          sortBy: "transaction_date",
          sortOrder: "DESC",
        });

        if (isRefresh || targetPage === 1) {
          setTransactions(res);
        } else {
          setTransactions((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const newItems = res.filter((item) => !existingIds.has(item.id));
            return [...prev, ...newItems];
          });
        }

        setHasMore(res.length === PAGE_SIZE);

        // Overall summary across the entire database
        const overall = transactionRepo.getSummary();
        setOverallSummary({
          totalIncome: overall.totalIncome,
          totalExpense: overall.totalExpense,
          net: overall.totalIncome - overall.totalExpense,
        });
      } catch (error) {
        console.error("Failed to load history data:", error);
      }
    },
    [],
  );

  // Load calendar monthly breakdown whenever currentMonth changes
  const loadMonthCalendarData = useCallback((month: Dayjs) => {
    try {
      const monthStr = month.format("YYYY-MM");
      const dailies = transactionRepo.getDailySummaryByMonth(monthStr);
      setDailySummaries(dailies);

      const mSummary = transactionRepo.getSummary({ datePrefix: monthStr });
      setMonthSummary(mSummary);
    } catch (error) {
      console.error("Failed to load calendar month data:", error);
    }
  }, []);

  // Reload when screen focused
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      loadMonthCalendarData(currentMonth);
      loadData(1, filter, activeDatePrefix, true);
    }, [filter, activeDatePrefix, currentMonth, loadData, loadMonthCalendarData]),
  );

  // When month or selectedDate or filter changes
  useEffect(() => {
    loadMonthCalendarData(currentMonth);
    setPage(1);
    loadData(1, filter, activeDatePrefix, true);
  }, [currentMonth, selectedDate, filter, activeDatePrefix, loadData, loadMonthCalendarData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(1);
    loadMonthCalendarData(currentMonth);
    loadData(1, filter, activeDatePrefix, true);
    setIsRefreshing(false);
  }, [currentMonth, filter, activeDatePrefix, loadData, loadMonthCalendarData]);

  const handleEndReached = useCallback(() => {
    if (!hasMore || isLoadingMore || isRefreshing) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage, filter, activeDatePrefix, false);
    setIsLoadingMore(false);
  }, [hasMore, isLoadingMore, isRefreshing, page, filter, activeDatePrefix, loadData]);

  const handleSelectFilter = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  const handlePrevMonth = useCallback(() => {
    setSelectedDate(null);
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  }, []);

  const handleNextMonth = useCallback(() => {
    setSelectedDate(null);
    setCurrentMonth((prev) => prev.add(1, "month"));
  }, []);

  const handleSelectMonthDate = useCallback((date: Date) => {
    setSelectedDate(null);
    setCurrentMonth(dayjs(date).startOf("month"));
  }, []);

  const handleToday = useCallback(() => {
    const today = dayjs();
    setCurrentMonth(today.startOf("month"));
    setSelectedDate(today.format("YYYY-MM-DD"));
  }, []);

  const handleSelectDate = useCallback((dateKey: string | null) => {
    setSelectedDate(dateKey);
  }, []);

  const handleToggleCalendarExpand = useCallback(() => {
    setIsCalendarExpanded((prev) => !prev);
  }, []);

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
    currentMonth,
    selectedDate,
    dailySummaries,
    monthSummary,
    isCalendarExpanded,
    transactions,
    groupedTransactions,
    hasMore,
    isRefreshing,
    isLoadingMore,
    summary: overallSummary,
    handleRefresh,
    handleEndReached,
    handleSelectFilter,
    handlePrevMonth,
    handleNextMonth,
    handleSelectMonthDate,
    handleToday,
    handleSelectDate,
    handleToggleCalendarExpand,
    handleTransactionPress,
    handleAddTransaction,
  };
};
