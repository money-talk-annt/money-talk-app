import React, { memo, useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Box from "../../components/Box";
import Flex from "../../components/Flex/Flex";
import Text from "../../components/Text";
import { useDashboard, RecentFilterType } from "./useDashboard";
import { THEME } from "../../theme";
import { formatCurrency } from "../../utils/formatCurrency";
import { IconName, icons } from "../../assets/icons";
import { withOpacity } from "../../utils/opacity";
import { mapI18n } from "../../utils/mapI18n";
import dayjs from "../../utils/dayjs";
import { GetTransaction } from "../../database/repository/transaction";
import { GetWallet } from "../../database/repository/wallet";
import { Scroll } from "../../components/ScrollView/ScrollView";

function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const {
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
  } = useDashboard();

  return (
    <Box bgColor="background" style={styles.container}>
      <Scroll
        isScreen
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={THEME.colors.primary}
            colors={[THEME.colors.primary]}
          />
        }
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 10,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        {/* ==================== 1. GREETING HEADER ==================== */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text type="headlineMd" color="text" style={styles.greetingText}>
                {t("greeting")}
              </Text>
              <Text type="labelSm" color="textSecondary">
                {formattedDate}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNavigateToHistory}
            style={styles.headerIconButton}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={THEME.colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* ==================== 2. EXECUTIVE HERO BALANCE CARD ==================== */}
        <View style={styles.heroCard}>
          {/* Card Top: Label & Eye Privacy Toggle */}
          <View style={styles.heroCardTop}>
            <View style={styles.heroLabelRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color="rgba(255, 255, 255, 0.75)"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.heroLabel}>
                {t("totalBalance").toUpperCase()}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={toggleBalanceVisibility}
              style={styles.eyeButton}
              accessibilityLabel={
                isBalanceVisible ? t("hideBalance") : t("showBalance")
              }
            >
              <Ionicons
                name={isBalanceVisible ? "eye-outline" : "eye-off-outline"}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Card Middle: Balance Value */}
          <View style={styles.heroBalanceContainer}>
            <Text
              type="displayLg"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.heroBalanceValue}
            >
              {isBalanceVisible ? formatCurrency(totalBalance) : "•••••••• ₫"}
            </Text>
          </View>

          {/* Card Divider */}
          <View style={styles.heroDivider} />

          {/* Card Bottom: Monthly Cashflow Stats */}
          <View style={styles.heroStatsRow}>
            {/* Income */}
            <View style={styles.heroStatItem}>
              <View style={[styles.statIconBadge, styles.statIncomeBadge]}>
                <Ionicons name="arrow-down" size={14} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statLabel}>
                  {t("monthCashflow.income")}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.statValueIncome}
                >
                  {isBalanceVisible
                    ? `+${formatCurrency(monthCashflow.income)}`
                    : "••••••"}
                </Text>
              </View>
            </View>

            {/* Separator */}
            <View style={styles.heroStatSeparator} />

            {/* Expense */}
            <View style={styles.heroStatItem}>
              <View style={[styles.statIconBadge, styles.statExpenseBadge]}>
                <Ionicons name="arrow-up" size={14} color="#EF4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statLabel}>
                  {t("monthCashflow.expense")}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.statValueExpense}
                >
                  {isBalanceVisible
                    ? `-${formatCurrency(monthCashflow.expense)}`
                    : "••••••"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ==================== 4. MY WALLETS CAROUSEL ==================== */}
        <View style={styles.sectionHeader}>
          <Flex align="center" gap={8}>
            <Text type="bodyLgBold" color="text">
              {t("myWallets")}
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{wallets.length}</Text>
            </View>
          </Flex>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNavigateToWallets}
            style={styles.seeAllButton}
          >
            <Text type="labelSm" color="primary">
              {t("seeAll")}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={THEME.colors.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.walletsList}
        >
          {wallets.map((item: GetWallet) => {
            const ComponentIcon = icons[(item.icon || "cash") as IconName];
            const walletBg = withOpacity(
              0.12,
              item.color || THEME.colors.primary,
            );

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={handleNavigateToWallets}
                style={[
                  styles.walletCard,
                  {
                    borderColor: withOpacity(
                      0.25,
                      item.color || THEME.colors.primary,
                    ),
                  },
                ]}
              >
                <View style={styles.walletCardHeader}>
                  <View
                    style={[
                      styles.walletIconContainer,
                      { backgroundColor: walletBg },
                    ]}
                  >
                    {ComponentIcon ? (
                      <ComponentIcon
                        height={20}
                        width={20}
                        stroke={item.color || THEME.colors.primary}
                      />
                    ) : (
                      <Ionicons
                        name="wallet-outline"
                        size={18}
                        color={item.color || THEME.colors.primary}
                      />
                    )}
                  </View>
                  <View
                    style={[
                      styles.walletColorDot,
                      { backgroundColor: item.color || THEME.colors.primary },
                    ]}
                  />
                </View>

                <View style={styles.walletCardBody}>
                  <Text
                    numberOfLines={1}
                    type="labelMdBold"
                    color="text"
                    style={styles.walletName}
                  >
                    {item.name}
                  </Text>
                  <Text type="labelSm" color="textSecondary">
                    {t("availableFunds")}
                  </Text>
                  <Text
                    numberOfLines={1}
                    type="bodyMdBold"
                    color="text"
                    style={styles.walletBalance}
                  >
                    {isBalanceVisible
                      ? formatCurrency(item.balance)
                      : "•••••• ₫"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Add Wallet End-Card */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNavigateToAddWallet}
            style={styles.addWalletCard}
          >
            <View style={styles.addWalletIconCircle}>
              <Ionicons name="add" size={22} color={THEME.colors.primary} />
            </View>
            <Text type="labelSm" color="primary" style={styles.addWalletText}>
              {t("addNewWallet")}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ==================== 5. RECENT ACTIVITY ==================== */}
        <View style={styles.sectionHeader}>
          <Text type="bodyLgBold" color="text">
            {t("recentActivity")}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNavigateToHistory}
            style={styles.seeAllButton}
          >
            <Text type="labelSm" color="primary">
              {t("seeAll")}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={THEME.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPillsContainer}>
          {(["all", "expense", "income"] as RecentFilterType[]).map((tab) => {
            const isActive = recentFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.75}
                onPress={() => setRecentFilter(tab)}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
              >
                <Text
                  type="labelSm"
                  color={isActive ? "card" : "textSecondary"}
                  style={isActive ? styles.filterPillTextActive : undefined}
                >
                  {t(tab)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          {transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="receipt-outline"
                  size={32}
                  color={THEME.colors.textSecondary}
                />
              </View>
              <Text type="labelMdBold" color="text" style={styles.emptyTitle}>
                {t("empty.title")}
              </Text>
              <Text
                type="labelSm"
                color="textSecondary"
                align="center"
                style={styles.emptySubtitle}
              >
                {t("empty.subtitle")}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleOpenAddTransaction()}
                style={styles.emptyButton}
              >
                <Text type="labelMdBold" color="card">
                  {t("empty.cta")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            transactions.map((item: GetTransaction) => {
              const isIncome = item.type === "income";
              const isLocket = Boolean(
                item.image_uri || item.category === "locket",
              );
              const categoryKey = mapI18n(item.category);
              const categoryName = isLocket
                ? item.note || tCommon("categories.locket") || "Ảnh chụp"
                : categoryKey
                  ? tCommon(categoryKey)
                  : item.category;
              const ComponentIcon =
                icons[(item.category || "cash") as IconName] || icons.cash;
              const timeFormatted = item.transactionDate
                ? dayjs(item.transactionDate).format("HH:mm")
                : "";

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => handleClickTransaction(item.id)}
                  style={styles.transactionCard}
                >
                  <Flex align="center" justify="space-between" gap={12}>
                    <Flex align="center" gap={12} style={{ flex: 1 }}>
                      {isLocket && item.image_uri ? (
                        <Image
                          source={{ uri: item.image_uri }}
                          style={styles.locketThumbnail}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={[
                            styles.transactionIconBox,
                            {
                              backgroundColor: isIncome
                                ? THEME.colors.bgSecondary
                                : THEME.colors.bgPrimary,
                            },
                          ]}
                        >
                          {isLocket ? (
                            <Ionicons
                              name="camera"
                              size={20}
                              color={
                                isIncome
                                  ? THEME.colors.secondary
                                  : THEME.colors.primary
                              }
                            />
                          ) : (
                            <ComponentIcon
                              height={24}
                              width={24}
                              color={
                                isIncome
                                  ? THEME.colors.secondary
                                  : THEME.colors.primary
                              }
                            />
                          )}
                        </View>
                      )}

                      <View style={{ flex: 1 }}>
                        <Flex align="center" gap={6}>
                          <Text
                            numberOfLines={1}
                            type="bodyMdBold"
                            color="text"
                            style={{ flexShrink: 1 }}
                          >
                            {categoryName}
                          </Text>
                          {isLocket && (
                            <View style={styles.locketTag}>
                              <Ionicons
                                name="camera-outline"
                                size={10}
                                color={THEME.colors.primary}
                                style={{ marginRight: 3 }}
                              />
                              <Text style={styles.locketTagText}>Locket</Text>
                            </View>
                          )}
                        </Flex>

                        <Flex align="center" gap={6} style={{ marginTop: 2 }}>
                          {item.walletName ? (
                            <View style={styles.walletPill}>
                              <Text style={styles.walletPillText}>
                                {item.walletName}
                              </Text>
                            </View>
                          ) : null}
                          {timeFormatted ? (
                            <Text type="labelSm" color="textSecondary">
                              {timeFormatted}
                            </Text>
                          ) : null}
                        </Flex>
                      </View>
                    </Flex>

                    <Text
                      type="labelMdBold"
                      color={isIncome ? "secondary" : "expense"}
                      style={styles.transactionAmount}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(item.amount)}
                    </Text>
                  </Flex>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </Scroll>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.container,
  },

  // 1. Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: THEME.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  greetingText: {
    fontWeight: "700",
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.card,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  // 2. Executive Hero Balance Card
  heroCard: {
    backgroundColor: "#1F2370",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#1F2370",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroLabelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroLabel: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  eyeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBalanceContainer: {
    marginVertical: 10,
    justifyContent: "center",
    minHeight: 52,
  },
  heroBalanceValue: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 46,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginBottom: 14,
  },
  heroStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroStatItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  heroStatSeparator: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginHorizontal: 12,
  },
  statIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statIncomeBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  statExpenseBadge: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  statValueIncome: {
    color: "#34D399",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  statValueExpense: {
    color: "#F87171",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },

  // 3. Quick Actions
  quickActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.colors.card,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quickActionItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  quickActionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontWeight: "600",
    textAlign: "center",
  },

  // 4. My Wallets
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  countBadge: {
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  walletsList: {
    gap: 12,
    paddingBottom: 20,
  },
  walletCard: {
    width: 170,
    backgroundColor: THEME.colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  walletCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  walletIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  walletColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  walletCardBody: {
    gap: 2,
  },
  walletName: {
    fontWeight: "700",
  },
  walletBalance: {
    marginTop: 2,
    fontWeight: "700",
  },
  addWalletCard: {
    width: 130,
    backgroundColor: THEME.colors.surfaceLow,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    gap: 8,
  },
  addWalletIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  addWalletText: {
    fontWeight: "600",
    textAlign: "center",
  },

  // 5. Recent Activity
  filterPillsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: THEME.colors.card,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
  },
  filterPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterPillTextActive: {
    fontWeight: "700",
  },
  transactionsContainer: {
    gap: 8,
  },
  transactionCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.04)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  transactionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  locketThumbnail: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: THEME.colors.surfaceLow,
  },
  locketTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(93, 95, 239, 0.12)",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  locketTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  walletPill: {
    backgroundColor: THEME.colors.surfaceLow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  walletPillText: {
    fontSize: 10,
    color: THEME.colors.primary,
    fontWeight: "600",
  },
  transactionAmount: {
    fontWeight: "700",
  },

  // Empty State
  emptyContainer: {
    backgroundColor: THEME.colors.card,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.colors.surfaceLow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontWeight: "700",
    marginBottom: 6,
  },
  emptySubtitle: {
    marginBottom: 16,
    maxWidth: 240,
  },
  emptyButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
});

const DashBoard = memo(DashboardScreen);
export default DashBoard;
