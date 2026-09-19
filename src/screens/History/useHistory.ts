import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Dayjs } from "dayjs";
import dayjs from "../../utils/dayjs";
import {
  GetTransaction,
  transactionRepo,
} from "../../database/repository/transaction";
import {
  DailySummary,
  FilterType,
  HistorySummary,
  TransactionGroup,
} from "./type";
import { PATHNAME } from "../../constants/pathname";
import {
  setSkipScrollToTop,
  shouldSkipScrollToTop,
} from "../../utils/navigationScrollHelper";
import {
  formatCompactAmount,
  formatCurrency,
} from "../../utils/formatCurrency";

const PAGE_SIZE = 20;

export type ViewMode = "list" | "grid";

export const useHistory = () => {
  const { t, i18n } = useTranslation("history");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation<AppNavigation>();

  const [filter, setFilter] = useState<FilterType>("all");
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(
    dayjs().startOf("month"),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(true);

  const [transactions, setTransactions] = useState<GetTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Locket grid state — independent from list state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [locketTransactions, setLocketTransactions] = useState<
    GetTransaction[]
  >([]);
  const [locketPage, setLocketPage] = useState(1);
  const [locketHasMore, setLocketHasMore] = useState(true);
  const [locketIsLoadingMore, setLocketIsLoadingMore] = useState(false);

  const [dailySummaries, setDailySummaries] = useState<DailySummary>({});
  const [monthSummary, setMonthSummary] = useState<{
    totalIncome: number;
    totalExpense: number;
  }>({
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
    (
      targetPage: number,
      targetFilter: FilterType,
      datePrefix: string,
      isRefresh = false,
    ) => {
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

  // Load locket transactions for grid view
  const loadLocketData = useCallback(
    (targetPage: number, datePrefix: string, isRefresh = false) => {
      try {
        const res = transactionRepo.getLocketTransactions({
          page: targetPage,
          pageSize: PAGE_SIZE,
          datePrefix,
        });

        if (isRefresh || targetPage === 1) {
          setLocketTransactions(res);
        } else {
          setLocketTransactions((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const newItems = res.filter((item) => !existingIds.has(item.id));
            return [...prev, ...newItems];
          });
        }

        setLocketHasMore(res.length === PAGE_SIZE);
      } catch (error) {
        console.error("Failed to load locket data:", error);
      }
    },
    [],
  );

  const pageRef = useRef(page);
  pageRef.current = page;

  // Reload when screen focused
  useFocusEffect(
    useCallback(() => {
      const skipScroll = shouldSkipScrollToTop();
      loadMonthCalendarData(currentMonth);

      if (skipScroll) {
        // Returning from detail: keep current loaded pages so scroll position doesn't jump
        const currentPage = pageRef.current || 1;
        const res = transactionRepo.gets({
          type: filter === "all" ? "all" : filter,
          datePrefix: activeDatePrefix,
          page: 1,
          pageSize: currentPage * PAGE_SIZE,
          sortBy: "transaction_date",
          sortOrder: "DESC",
        });

        setTransactions(res);
        setHasMore(res.length === currentPage * PAGE_SIZE);

        const overall = transactionRepo.getSummary();
        setOverallSummary({
          totalIncome: overall.totalIncome,
          totalExpense: overall.totalExpense,
          net: overall.totalIncome - overall.totalExpense,
        });
      } else {
        // Tab switch or initial entrance: reset to page 1
        setPage(1);
        loadData(1, filter, activeDatePrefix, true);
      }
    }, [
      filter,
      activeDatePrefix,
      currentMonth,
      loadData,
      loadMonthCalendarData,
    ]),
  );

  // When month or selectedDate or filter changes
  useEffect(() => {
    loadMonthCalendarData(currentMonth);
    setPage(1);
    loadData(1, filter, activeDatePrefix, true);
  }, [
    currentMonth,
    selectedDate,
    filter,
    activeDatePrefix,
    loadData,
    loadMonthCalendarData,
  ]);

  // Reload locket data when month/date changes
  useEffect(() => {
    if (viewMode === "grid") {
      setLocketPage(1);
      loadLocketData(1, activeDatePrefix, true);
    }
  }, [currentMonth, selectedDate, viewMode, activeDatePrefix, loadLocketData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadMonthCalendarData(currentMonth);
    if (viewMode === "grid") {
      setLocketPage(1);
      loadLocketData(1, activeDatePrefix, true);
    } else {
      setPage(1);
      loadData(1, filter, activeDatePrefix, true);
    }
    setIsRefreshing(false);
  }, [
    currentMonth,
    filter,
    activeDatePrefix,
    loadData,
    loadMonthCalendarData,
    viewMode,
    loadLocketData,
  ]);

  const handleEndReached = useCallback(() => {
    if (!hasMore || isLoadingMore || isRefreshing) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage, filter, activeDatePrefix, false);
    setIsLoadingMore(false);
  }, [
    hasMore,
    isLoadingMore,
    isRefreshing,
    page,
    filter,
    activeDatePrefix,
    loadData,
  ]);

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
      setSkipScrollToTop(true);
      navigation.navigate("TransactionDetail", { id });
    },
    [navigation],
  );

  const handleAddTransaction = useCallback(() => {
    navigation.getParent()?.navigate(PATHNAME.TRANSACTION_ROOT);
  }, [navigation]);

  const handleToggleViewMode = useCallback(() => {
    setViewMode((prev) => {
      const next = prev === "list" ? "grid" : "list";
      if (next === "grid") {
        setLocketPage(1);
        loadLocketData(1, activeDatePrefix, true);
        setIsCalendarExpanded(false);
      }
      return next;
    });
  }, [activeDatePrefix, loadLocketData]);

  const handleLocketEndReached = useCallback(() => {
    if (!locketHasMore || locketIsLoadingMore) return;

    setLocketIsLoadingMore(true);
    const nextPage = locketPage + 1;
    setLocketPage(nextPage);
    loadLocketData(nextPage, activeDatePrefix, false);
    setLocketIsLoadingMore(false);
  }, [
    locketHasMore,
    locketIsLoadingMore,
    locketPage,
    activeDatePrefix,
    loadLocketData,
  ]);

  // Group transactions by date periods
  const groupTransactions = useCallback(
    (items: GetTransaction[]) => {
      const groupsMap = new Map<string, TransactionGroup>();
      const now = dayjs();
      const yesterday = dayjs().subtract(1, "day");

      items.forEach((tx) => {
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
    },
    [t, i18n.language],
  );

  const groupedTransactions = useMemo(
    () => groupTransactions(transactions),
    [transactions, groupTransactions],
  );

  const groupedLocketTransactions = useMemo(
    () => groupTransactions(locketTransactions),
    [locketTransactions, groupTransactions],
  );

  const formatCurrencyHistory = useCallback((amount: number) => {
    let result = "";

    if (amount < 0) {
      result = "-";
    }

    if (Math.abs(amount).toString().length >= 8) {
      return result + formatCompactAmount(Math.abs(amount));
    }
    return result + formatCurrency(Math.abs(amount));
  }, []);

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
    viewMode,
    locketTransactions,
    groupedLocketTransactions,
    locketHasMore,
    locketIsLoadingMore,
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
    handleToggleViewMode,
    handleLocketEndReached,
    formatCurrencyHistory,
  };
};
