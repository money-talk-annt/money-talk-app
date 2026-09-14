import { memo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../theme";
import Box from "../../components/Box";
import Flex from "../../components/Flex/Flex";
import Text from "../../components/Text";
import { formatCurrency } from "../../utils/formatCurrency";
import { mapI18n } from "../../utils/mapI18n";
import { useHistory } from "./useHistory";
import { FilterType, TransactionGroup } from "./type";
import { GetTransaction } from "../../database/repository/transaction";
import { HistoryCalendar } from "./components/HistoryCalendar";
import dayjs from "../../utils/dayjs";

const getCategoryIconName = (category: string) => {
  switch (category?.toLowerCase()) {
    case "food":
      return "fast-food-outline";
    case "car":
      return "car-sport-outline";
    case "bag":
      return "bag-handle-outline";
    case "home":
      return "home-outline";
    case "health":
      return "fitness-outline";
    case "coffee":
      return "cafe-outline";
    case "cash":
      return "cash-outline";
    case "gift":
      return "gift-outline";
    case "bank":
      return "business-outline";
    case "sale":
      return "pricetag-outline";
    case "pc":
      return "laptop-outline";
    case "refund":
      return "arrow-undo-outline";
    case "trending":
      return "trending-up-outline";
    default:
      return "receipt-outline";
  }
};

const HistoryScreen = () => {
  const {
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
    summary,
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
  } = useHistory();

  const filterTabs: {
    type: FilterType;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { type: "all", label: t("all"), icon: "list-outline" },
    { type: "income", label: t("income"), icon: "arrow-down-circle-outline" },
    { type: "expense", label: t("expense"), icon: "arrow-up-circle-outline" },
  ];

  const renderSectionHeader = ({
    section,
  }: {
    section: TransactionGroup;
  }) => {
    return (
      <View style={styles.sectionHeaderContainer}>
        <View style={styles.sectionHeaderBadge}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color={THEME.colors.primary}
            style={{ marginRight: 6 }}
          />
          <Text type="labelMdBold" color="text">
            {section.title}
          </Text>
        </View>

        <View style={styles.sectionHeaderStats}>
          {section.dayIncome > 0 && (
            <Text type="labelSm" color="secondary" style={styles.dayStatText}>
              +{formatCurrency(section.dayIncome)}
            </Text>
          )}
          {section.dayExpense > 0 && (
            <Text type="labelSm" color="expense" style={styles.dayStatText}>
              -{formatCurrency(section.dayExpense)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: GetTransaction }) => {
    const isIncome = item.type === "income";
    const categoryKey = mapI18n(item.category);
    const categoryName = categoryKey ? tCommon(categoryKey) : item.category;
    const iconName = getCategoryIconName(item.category);
    const timeFormatted = item.transactionDate
      ? dayjs(item.transactionDate).format("HH:mm")
      : "";

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleTransactionPress(item.id)}
        style={styles.cardTouchable}
      >
        <Box style={styles.transactionCard}>
          <Flex align="center" justify="space-between" gap={8}>
            {/* Left info */}
            <Flex align="center" gap={12} style={{ flex: 1 }}>
              <View
                style={[
                  styles.iconWrapper,
                  {
                    backgroundColor: isIncome
                      ? THEME.colors.bgSecondary
                      : THEME.colors.bgPrimary,
                  },
                ]}
              >
                <Ionicons
                  name={iconName as any}
                  size={24}
                  color={
                    isIncome ? THEME.colors.secondary : THEME.colors.primary
                  }
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  type="bodyMdBold"
                  color="text"
                  style={{ marginBottom: 2 }}
                >
                  {categoryName}
                </Text>

                {Boolean(item.note) && (
                  <Text
                    numberOfLines={1}
                    type="labelSm"
                    color="textSecondary"
                    style={{ marginBottom: 2 }}
                  >
                    {item.note}
                  </Text>
                )}

                <Flex align="center" gap={6}>
                  {Boolean(item.walletName) && (
                    <View style={styles.walletPill}>
                      <Text type="labelSm" color="primary">
                        {item.walletName}
                      </Text>
                    </View>
                  )}
                  {Boolean(timeFormatted) && (
                    <Text type="labelSm" color="textSecondary">
                      {timeFormatted}
                    </Text>
                  )}
                </Flex>
              </View>
            </Flex>

            {/* Right amount */}
            <View style={{ alignItems: "flex-end" }}>
              <Text
                type="bodyMdBold"
                color={isIncome ? "secondary" : "expense"}
              >
                {`${isIncome ? "+" : "-"} ${formatCurrency(item.amount)}`}
              </Text>
            </View>
          </Flex>
        </Box>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={THEME.colors.primary} />
          <Text type="labelSm" color="textSecondary" style={{ marginLeft: 8 }}>
            {t("loadingMore")}
          </Text>
        </View>
      );
    }

    if (!hasMore && transactions.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <View style={styles.footerDot} />
          <Text type="labelSm" color="textSecondary" style={{ marginHorizontal: 8 }}>
            {t("noMore")}
          </Text>
          <View style={styles.footerDot} />
        </View>
      );
    }

    return <View style={{ height: 24 }} />;
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons
            name="receipt-outline"
            size={48}
            color={THEME.colors.primary}
          />
        </View>
        <Text type="headlineMd" color="text" style={{ marginTop: 16 }}>
          {t("empty.title")}
        </Text>
        <Text
          type="labelSm"
          color="textSecondary"
          style={{ textAlign: "center", marginTop: 8, paddingHorizontal: 32 }}
        >
          {t("empty.subtitle")}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAddTransaction}
          style={styles.emptyAddButton}
        >
          <Ionicons name="add" size={20} color={THEME.colors.white} />
          <Text type="labelMdBold" color="white" style={{ marginLeft: 6 }}>
            {t("empty.addTransaction")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderListHeader = () => {
    return (
      <View>
        {/* Top Header Title */}
        <View style={styles.header}>
          <Text type="headlineLg" color="text">
            {t("title")}
          </Text>
        </View>

        {/* Overview Statistics Card */}
        <View style={styles.summaryCard}>
          <Flex justify="space-between" align="center">
            {/* Income stat */}
            <View style={styles.summaryItem}>
              <Flex align="center" gap={4} style={{ marginBottom: 4 }}>
                <Ionicons
                  name="arrow-down-circle"
                  size={16}
                  color={THEME.colors.secondary}
                />
                <Text type="labelSm" color="textSecondary">
                  {t("overview.totalIncome")}
                </Text>
              </Flex>
              <Text type="bodyMdBold" color="secondary" numberOfLines={1}>
                +{formatCurrency(summary.totalIncome)}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            {/* Expense stat */}
            <View style={styles.summaryItem}>
              <Flex align="center" gap={4} style={{ marginBottom: 4 }}>
                <Ionicons
                  name="arrow-up-circle"
                  size={16}
                  color={THEME.colors.expense}
                />
                <Text type="labelSm" color="textSecondary">
                  {t("overview.totalExpense")}
                </Text>
              </Flex>
              <Text type="bodyMdBold" color="expense" numberOfLines={1}>
                -{formatCurrency(summary.totalExpense)}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            {/* Net stat */}
            <View style={styles.summaryItem}>
              <Flex align="center" gap={4} style={{ marginBottom: 4 }}>
                <Ionicons
                  name="wallet"
                  size={16}
                  color={THEME.colors.primary}
                />
                <Text type="labelSm" color="textSecondary">
                  {t("overview.net")}
                </Text>
              </Flex>
              <Text
                type="bodyMdBold"
                color={summary.net >= 0 ? "primary" : "expense"}
                numberOfLines={1}
              >
                {formatCurrency(summary.net)}
              </Text>
            </View>
          </Flex>
        </View>

        {/* Financial Calendar */}
        <HistoryCalendar
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          dailySummaries={dailySummaries}
          monthIncome={monthSummary.totalIncome}
          monthExpense={monthSummary.totalExpense}
          isExpanded={isCalendarExpanded}
          onToggleExpand={handleToggleCalendarExpand}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectDate={handleSelectDate}
          onSelectMonthDate={handleSelectMonthDate}
          onToday={handleToday}
          t={t}
        />

        {/* Filter Tabs */}
        <View style={styles.filterBar}>
          {filterTabs.map((item) => {
            const isActive = filter === item.type;
            return (
              <TouchableOpacity
                key={item.type}
                activeOpacity={0.7}
                onPress={() => handleSelectFilter(item.type)}
                style={[
                  styles.filterTab,
                  isActive && styles.filterTabActive,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={16}
                  color={
                    isActive ? THEME.colors.white : THEME.colors.textSecondary
                  }
                  style={{ marginRight: 6 }}
                />
                <Text
                  type="labelMdBold"
                  color={isActive ? "white" : "textSecondary"}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Main Paginated Section List with Header */}
      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={THEME.colors.primary}
            colors={[THEME.colors.primary]}
          />
        }
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
    padding: 16,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.card,
    borderWidth: 1,
    borderColor: THEME.colors.bgPrimary,
    elevation: 2,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: THEME.colors.border,
    opacity: 0.4,
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  filterTabActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeaderBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sectionHeaderStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dayStatText: {
    fontSize: 12,
  },
  cardTouchable: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  transactionCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.bgPrimary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  walletPill: {
    backgroundColor: THEME.colors.bgPrimary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.border,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.colors.bgPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: THEME.radius.full,
    marginTop: 20,
    elevation: 2,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

const History = memo(HistoryScreen);
export default History;
