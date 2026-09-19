import { memo, useCallback, useMemo } from "react";
import {
  Dimensions,
  Image,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../../theme";
import Text from "../../../components/Text";
import { GetTransaction } from "../../../database/repository/transaction";
import { TransactionGroup } from "../type";
import { formatCurrency } from "../../../utils/formatCurrency";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 16;
const GRID_GAP = 8;
const NUM_COLUMNS = 3;
export const LOCKET_ITEM_SIZE =
  (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;

type LocketSection = {
  title: string;
  dateKey: string;
  dayIncome: number;
  dayExpense: number;
  data: GetTransaction[][]; // chunked rows of up to NUM_COLUMNS
  rawSection: TransactionGroup;
};

type LocketGridProps = {
  sections: TransactionGroup[];
  isLoadingMore: boolean;
  hasMore: boolean;
  onEndReached: () => void;
  onTransactionPress: (id: number) => void;
  renderEmpty: () => React.ReactElement;
  renderSectionHeader?: (info: { section: TransactionGroup }) => React.ReactElement;
  ListHeaderComponent?: React.ReactElement | (() => React.ReactElement | null) | null;
  refreshControl?: React.ReactElement<any>;
};

const LocketGridItem = memo(
  ({
    item,
    onPress,
  }: {
    item: GetTransaction;
    onPress: (id: number) => void;
  }) => {
    const isIncome = item.type === "income";

    return (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => onPress(item.id)}
        style={styles.gridItem}
      >
        {item.image_uri ? (
          <Image
            source={{ uri: item.image_uri }}
            style={styles.gridImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.gridImage, styles.gridPlaceholder]}>
            <Ionicons name="image-outline" size={28} color={THEME.colors.border} />
          </View>
        )}

        {/* Locket badge overlay at bottom */}
        <View style={styles.gridOverlay}>
          <View style={styles.amountPill}>
            <View
              style={[
                styles.typeDot,
                {
                  backgroundColor: isIncome
                    ? THEME.colors.secondary
                    : THEME.colors.expense,
                },
              ]}
            />
            <Text type="labelSm" numberOfLines={1} style={styles.gridAmount}>
              {isIncome ? "+" : "-"}
              {formatCurrency(item.amount)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

export const LocketGrid = memo(
  ({
    sections,
    isLoadingMore,
    hasMore,
    onEndReached,
    onTransactionPress,
    renderEmpty,
    renderSectionHeader,
    ListHeaderComponent,
    refreshControl,
  }: LocketGridProps) => {
    const { t } = useTranslation("history");

    // Chunk transactions into rows of NUM_COLUMNS for grid layout within each section
    const chunkedSections = useMemo<LocketSection[]>(() => {
      return sections
        .filter((sec) => sec.data.length > 0)
        .map((sec) => {
          const rows: GetTransaction[][] = [];
          for (let i = 0; i < sec.data.length; i += NUM_COLUMNS) {
            rows.push(sec.data.slice(i, i + NUM_COLUMNS));
          }
          return {
            title: sec.title,
            dateKey: sec.dateKey,
            dayIncome: sec.dayIncome,
            dayExpense: sec.dayExpense,
            data: rows,
            rawSection: sec,
          };
        });
    }, [sections]);

    const renderItem = useCallback(
      ({ item: row }: { item: GetTransaction[] }) => (
        <View style={styles.gridRow}>
          {row.map((tx) => (
            <LocketGridItem
              key={tx.id}
              item={tx}
              onPress={onTransactionPress}
            />
          ))}
          {/* Fill remaining slots so items don't stretch */}
          {row.length < NUM_COLUMNS &&
            Array.from({ length: NUM_COLUMNS - row.length }).map((_, i) => (
              <View key={`placeholder-${i}`} style={styles.placeholderItem} />
            ))}
        </View>
      ),
      [onTransactionPress],
    );

    const renderHeader = useCallback(
      ({ section }: { section: LocketSection }) => {
        if (renderSectionHeader) {
          return renderSectionHeader({ section: section.rawSection });
        }

        return (
          <View style={styles.defaultSectionHeader}>
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
                <Text
                  type="labelSm"
                  color="secondary"
                  style={styles.dayStatText}
                >
                  +{formatCurrency(section.dayIncome)}
                </Text>
              )}
              {section.dayExpense > 0 && (
                <Text
                  type="labelSm"
                  color="expense"
                  style={styles.dayStatText}
                >
                  -{formatCurrency(section.dayExpense)}
                </Text>
              )}
            </View>
          </View>
        );
      },
      [renderSectionHeader],
    );

    const renderFooter = useCallback(() => {
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
      if (!hasMore && chunkedSections.length > 0) {
        return (
          <View style={styles.footerContainer}>
            <View style={styles.footerDot} />
            <Text
              type="labelSm"
              color="textSecondary"
              style={{ marginHorizontal: 8 }}
            >
              {t("noMore")}
            </Text>
            <View style={styles.footerDot} />
          </View>
        );
      }
      return <View style={{ height: 28 }} />;
    }, [isLoadingMore, hasMore, chunkedSections.length, t]);

    return (
      <SectionList
        sections={chunkedSections as any}
        keyExtractor={(item: GetTransaction[], index: number) =>
          `locket-row-${item.map((tx: GetTransaction) => tx.id).join("-")}-${index}`
        }
        renderItem={renderItem as any}
        renderSectionHeader={renderHeader as any}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        refreshControl={refreshControl}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
      />
    );
  },
);

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: GRID_GAP,
  },
  gridItem: {
    width: LOCKET_ITEM_SIZE,
    height: LOCKET_ITEM_SIZE,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: THEME.colors.surfaceLow,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  placeholderItem: {
    width: LOCKET_ITEM_SIZE,
    height: LOCKET_ITEM_SIZE,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME.colors.surfaceLow,
  },
  gridOverlay: {
    position: "absolute",
    bottom: 5,
    left: 4,
    right: 4,
    alignItems: "center",
  },
  amountPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 12, 18, 0.72)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    maxWidth: "100%",
  },
  typeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 4,
  },
  gridAmount: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  defaultSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 14,
    paddingBottom: 8,
  },
  sectionHeaderBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionHeaderStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dayStatText: {
    fontWeight: "600",
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
});

export default LocketGrid;
