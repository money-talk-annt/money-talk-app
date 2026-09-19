import { memo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Scroll } from "../../components/ScrollView/ScrollView";
import Box from "../../components/Box";
import Flex from "../../components/Flex/Flex";
import Text from "../../components/Text";
import Button from "../../components/Button";
import { useTransactionDetail } from "./useTransactionDetail";
import { THEME } from "../../theme";
import { formatCurrency } from "../../utils/formatCurrency";
import { mapI18n } from "../../utils/mapI18n";
import { withOpacity } from "../../utils/opacity";
import dayjs from "../../utils/dayjs";
import { IconName, icons } from "../../assets/icons";

const TransactionDetail = memo(() => {
  const {
    t,
    tCommon,
    data,
    isIncome,
    handleEdit,
    handleDelete,
  } = useTransactionDetail();

  if (!data) {
    return (
      <Box bgColor="background" style={styles.container}>
        <Box p="xl" style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Text type="bodyMd" color="outline">
            {t("detail.notFound")}
          </Text>
        </Box>
      </Box>
    );
  }

  const ComponentIcon = icons[(data.category || "cash") as IconName] || icons.cash;
  const WalletIcon = icons.wallet;

  const formattedDate = data.transactionDate
    ? dayjs(data.transactionDate).format("HH:mm - DD/MM/YYYY")
    : "---";

  return (
    <Box bgColor="background" style={styles.container}>
      <Scroll
        contentContainerStyle={styles.scrollContent}
      >
        {/* ==================== 1. HERO CATEGORY & AMOUNT CARD ==================== */}
        <View style={styles.heroCard}>
          {data.image_uri ? (
            /* Locket Mode: Photo hero */
            <>
              <View style={styles.locketImageContainer}>
                <Image
                  source={{ uri: data.image_uri }}
                  style={styles.locketImage}
                  resizeMode="cover"
                />
              </View>

              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor: withOpacity(
                      0.1,
                      isIncome ? THEME.colors.secondary : THEME.colors.primary,
                    ),
                    marginTop: 14,
                  },
                ]}
              >
                <Text
                  type="labelMdBold"
                  color={isIncome ? "secondary" : "primary"}
                >
                  {isIncome ? t("income") : t("expense")}
                </Text>
              </View>

              <Text
                type="headlineLg"
                color={isIncome ? "secondary" : "text"}
                style={styles.amountText}
              >
                {isIncome ? "+" : "-"}{formatCurrency(data.amount)}
              </Text>
            </>
          ) : (
            /* Normal Mode: Category icon */
            <>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: withOpacity(
                      0.12,
                      isIncome ? THEME.colors.secondary : THEME.colors.primary,
                    ),
                  },
                ]}
              >
                <ComponentIcon
                  height={36}
                  width={36}
                  color={isIncome ? THEME.colors.secondary : THEME.colors.primary}
                />
              </View>

              <Text type="headlineMd" color="text" style={styles.categoryTitle}>
                {mapI18n(tCommon, data.category)}
              </Text>

              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor: withOpacity(
                      0.1,
                      isIncome ? THEME.colors.secondary : THEME.colors.primary,
                    ),
                  },
                ]}
              >
                <Text
                  type="labelMdBold"
                  color={isIncome ? "secondary" : "primary"}
                >
                  {isIncome ? t("income") : t("expense")}
                </Text>
              </View>

              <Text
                type="headlineLg"
                color={isIncome ? "secondary" : "text"}
                style={styles.amountText}
              >
                {isIncome ? "+" : "-"}{formatCurrency(data.amount)}
              </Text>
            </>
          )}
        </View>

        {/* ==================== 2. DETAILS CARD ==================== */}
        <View style={styles.detailsCard}>
          {/* Row: Wallet */}
          <View style={styles.detailRow}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIconContainer}>
                <WalletIcon width={20} height={20} stroke={THEME.colors.primary} />
              </View>
              <Text type="bodyMd" color="outline">
                {t("detail.wallet")}
              </Text>
            </View>
            <Text type="bodyMdBold" color="text">
              {data.walletName || t("defaultWallet")}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Row: Date & Time */}
          <View style={styles.detailRow}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIconContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={THEME.colors.primary}
                />
              </View>
              <Text type="bodyMd" color="outline">
                {t("detail.date")}
              </Text>
            </View>
            <Text type="bodyMdBold" color="text">
              {formattedDate}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Row: Note */}
          <View style={[styles.detailRow, { alignItems: "flex-start" }]}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIconContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={THEME.colors.primary}
                />
              </View>
              <Text type="bodyMd" color="outline">
                {t("detail.note")}
              </Text>
            </View>
            <View style={styles.noteValueContainer}>
              <Text
                type="bodyMd"
                color={data.note ? "text" : "outline"}
                style={!data.note ? styles.emptyNote : undefined}
              >
                {data.note || t("detail.noNote")}
              </Text>
            </View>
          </View>
        </View>

        {/* ==================== 3. ACTION BUTTONS ==================== */}
        <Box mt="xl" style={styles.actionContainer}>
          <Button
            title={t("detail.edit")}
            onPress={handleEdit}
            style={styles.editButton}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleDelete}
            style={styles.deleteButton}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={THEME.colors.error}
              style={{ marginRight: 8 }}
            />
            <Text type="bodyMdBold" style={{ color: THEME.colors.error }}>
              {t("detail.delete")}
            </Text>
          </TouchableOpacity>
        </Box>
      </Scroll>
    </Box>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.container,
    paddingTop: 24,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.xl,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  locketImageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 4,
  },
  locketImage: {
    width: "100%",
    height: "100%",
  },
  categoryTitle: {
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  amountText: {
    fontSize: 28,
    fontWeight: "700",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.xl,
    paddingVertical: 8,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceLow,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.surfaceLow,
  },
  noteValueContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginLeft: 16,
  },
  emptyNote: {
    fontStyle: "italic",
  },
  actionContainer: {
    gap: 12,
  },
  editButton: {
    backgroundColor: THEME.colors.primary,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: THEME.spacing.container,
    borderRadius: THEME.radius.lg,
    backgroundColor: withOpacity(0.08, THEME.colors.error),
    borderWidth: 1,
    borderColor: withOpacity(0.3, THEME.colors.error),
  },
});

export { TransactionDetail };
export default TransactionDetail;
