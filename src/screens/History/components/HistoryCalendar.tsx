import { memo, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dayjs } from "dayjs";
import dayjs from "../../../utils/dayjs";
import { THEME } from "../../../theme";
import Text from "../../../components/Text";
import Flex from "../../../components/Flex/Flex";
import { DailySummary } from "../type";

interface HistoryCalendarProps {
  currentMonth: Dayjs;
  selectedDate: string | null;
  dailySummaries: DailySummary;
  monthIncome: number;
  monthExpense: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (dateKey: string | null) => void;
  onSelectMonthDate: (date: Date) => void;
  onToday: () => void;
  t: any;
}

export const formatCompactAmount = (amount: number): string => {
  if (!amount || amount === 0) return "0";
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1).replace(".0", "")}B`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(".0", "")}M`;
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}k`;
  }
  return `${amount}`;
};

const HistoryCalendarComponent = ({
  currentMonth,
  selectedDate,
  dailySummaries,
  monthIncome,
  monthExpense,
  isExpanded,
  onToggleExpand,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onSelectMonthDate,
  onToday,
  t,
}: HistoryCalendarProps) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const today = useMemo(() => dayjs(), []);

  const isCurrentMonthNow = useMemo(() => {
    return currentMonth.isSame(today, "month");
  }, [currentMonth, today]);

  // Disable navigating to future months
  const canGoNext = useMemo(() => {
    return currentMonth.isBefore(today.startOf("month"), "month");
  }, [currentMonth, today]);

  const weekdays = useMemo(() => {
    return ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  }, []);

  const calendarDays = useMemo(() => {
    const daysInMonth = currentMonth.daysInMonth();
    // In dayjs, 0 = Sunday, 1 = Monday ... 6 = Saturday
    const firstDayOfWeek = currentMonth.startOf("month").day();
    // Shift so Monday is 0 and Sunday is 6
    const leadingBlanks = (firstDayOfWeek + 6) % 7;

    const days: {
      dayNumber: number | null;
      dateKey: string;
      isToday: boolean;
      isFuture: boolean;
      income: number;
      expense: number;
    }[] = [];

    // Blank cells before day 1
    for (let i = 0; i < leadingBlanks; i++) {
      days.push({
        dayNumber: null,
        dateKey: `blank-${i}`,
        isToday: false,
        isFuture: false,
        income: 0,
        expense: 0,
      });
    }

    // Days of the month
    const todayDate = dayjs();
    const todayStr = todayDate.format("YYYY-MM-DD");

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = currentMonth.date(d);
      const dateKey = dateObj.format("YYYY-MM-DD");
      const isFuture = dateObj.isAfter(todayDate, "day");
      const summary = dailySummaries[dateKey] || { totalIncome: 0, totalExpense: 0 };

      days.push({
        dayNumber: d,
        dateKey,
        isToday: dateKey === todayStr,
        isFuture,
        income: isFuture ? 0 : summary.totalIncome,
        expense: isFuture ? 0 : summary.totalExpense,
      });
    }

    return days;
  }, [currentMonth, dailySummaries]);

  const handleConfirmPicker = (date: Date) => {
    setIsPickerVisible(false);
    onSelectMonthDate(date);
  };

  return (
    <View style={styles.container}>
      {/* Calendar Header */}
      <View style={styles.headerRow}>
        <View style={styles.navGroup}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onPrevMonth}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={THEME.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.monthSelector}
            onPress={() => setIsPickerVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar"
              size={16}
              color={THEME.colors.primary}
              style={{ marginRight: 6 }}
            />
            <Text type="bodyMdBold" color="text">
              {currentMonth.format("MMMM, YYYY")}
            </Text>
            <Ionicons
              name="caret-down"
              size={12}
              color={THEME.colors.textSecondary}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, !canGoNext && styles.navButtonDisabled]}
            onPress={canGoNext ? onNextMonth : undefined}
            disabled={!canGoNext}
            activeOpacity={canGoNext ? 0.7 : 1}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={canGoNext ? THEME.colors.text : THEME.colors.outline}
            />
          </TouchableOpacity>
        </View>

        <Flex align="center" gap={6}>
          {!isCurrentMonthNow && (
            <TouchableOpacity
              style={styles.todayButton}
              onPress={onToday}
              activeOpacity={0.7}
            >
              <Text type="labelSm" color="primary">
                {t("calendar.today")}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.expandButton}
            onPress={onToggleExpand}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={18}
              color={THEME.colors.textSecondary}
            />
          </TouchableOpacity>
        </Flex>
      </View>

      {/* Month Sub-Summary Strip: strictly fixed height 36px so it never jumps */}
      <View style={styles.monthStatsBanner}>
        {/* Left: Thu */}
        <Flex
          align="center"
          gap={4}
          style={selectedDate ? { flex: 1, justifyContent: "flex-start" } : undefined}
        >
          <View style={[styles.dot, { backgroundColor: THEME.colors.secondary }]} />
          <Text type="labelSm" color="textSecondary">
            Thu:
          </Text>
          <Text type="labelSm" color="secondary" style={{ fontWeight: "600" }}>
            +{formatCompactAmount(monthIncome)}
          </Text>
        </Flex>

        {/* Center when selected, or Right when not selected: Chi */}
        <Flex
          align="center"
          gap={4}
          style={
            selectedDate
              ? { flex: 1, justifyContent: "center" }
              : { justifyContent: "flex-end" }
          }
        >
          <View style={[styles.dot, { backgroundColor: THEME.colors.expense }]} />
          <Text type="labelSm" color="textSecondary">
            Chi:
          </Text>
          <Text type="labelSm" color="expense" style={{ fontWeight: "600" }}>
            -{formatCompactAmount(monthExpense)}
          </Text>
        </Flex>

        {/* Right when selected: Xem cả tháng */}
        {Boolean(selectedDate) && (
          <Flex align="center" justify="flex-end" style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => onSelectDate(null)}
              style={styles.clearFilterPill}
              activeOpacity={0.7}
            >
              <Text type="labelSm" color="primary" style={{ fontWeight: "600" }}>
                {t("calendar.allMonth")}
              </Text>
              <Ionicons
                name="close-circle"
                size={14}
                color={THEME.colors.primary}
                style={{ marginLeft: 3 }}
              />
            </TouchableOpacity>
          </Flex>
        )}
      </View>

      {/* Expanded Grid */}
      {isExpanded && (
        <View style={styles.gridContainer}>
          {/* Weekday Row */}
          <View style={styles.weekdayRow}>
            {weekdays.map((day, idx) => (
              <View key={day} style={styles.weekdayCell}>
                <Text
                  type="labelSm"
                  color={idx >= 5 ? "expense" : "textSecondary"}
                  style={{ opacity: 0.8 }}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {calendarDays.map((item) => {
              if (item.dayNumber === null) {
                return <View key={item.dateKey} style={styles.dayCell} />;
              }

              const isSelected = selectedDate === item.dateKey;

              return (
                <TouchableOpacity
                  key={item.dateKey}
                  disabled={item.isFuture}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    item.isToday && !isSelected && styles.dayCellToday,
                    item.isFuture && styles.dayCellFuture,
                  ]}
                  onPress={() => {
                    if (item.isFuture) return;
                    onSelectDate(isSelected ? null : item.dateKey);
                  }}
                  activeOpacity={0.7}
                >
                  {/* Day Number */}
                  <View
                    style={[
                      styles.dayNumberCircle,
                      isSelected && styles.dayNumberCircleSelected,
                      item.isToday && !isSelected && styles.dayNumberCircleToday,
                    ]}
                  >
                    <Text
                      type="labelSm"
                      color={
                        item.isFuture
                          ? "textPlaceholder"
                          : isSelected
                          ? "white"
                          : item.isToday
                          ? "primary"
                          : "text"
                      }
                      style={{
                        fontWeight:
                          isSelected || item.isToday ? "700" : "600",
                        fontSize: 13,
                        opacity: item.isFuture ? 0.4 : 1,
                      }}
                    >
                      {item.dayNumber}
                    </Text>
                  </View>

                  {/* Income Amount */}
                  {!item.isFuture && item.income > 0 ? (
                    <Text
                      numberOfLines={1}
                      type="labelSm"
                      color="secondary"
                      style={styles.amountText}
                    >
                      +{formatCompactAmount(item.income)}
                    </Text>
                  ) : (
                    <View style={styles.amountPlaceholder} />
                  )}

                  {/* Expense Amount */}
                  {!item.isFuture && item.expense > 0 ? (
                    <Text
                      numberOfLines={1}
                      type="labelSm"
                      color="expense"
                      style={styles.amountText}
                    >
                      -{formatCompactAmount(item.expense)}
                    </Text>
                  ) : (
                    <View style={styles.amountPlaceholder} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Date Picker Modal for jumping to any past/present month */}
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        maximumDate={new Date()}
        date={currentMonth.toDate()}
        onConfirm={handleConfirmPicker}
        onCancel={() => setIsPickerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.bgPrimary,
    padding: 12,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  navGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceLow,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surfaceLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    marginHorizontal: 2,
  },
  todayButton: {
    backgroundColor: THEME.colors.surfaceLow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceLow,
    alignItems: "center",
    justifyContent: "center",
  },
  monthStatsBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.colors.surfaceLow,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    height: 36,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  clearFilterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.card,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  gridContainer: {
    marginTop: 8,
  },
  weekdayRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingBottom: 6,
    marginBottom: 4,
    opacity: 0.6,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.285%",
    minHeight: 52,
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  dayCellToday: {
    backgroundColor: "rgba(67, 67, 213, 0.04)",
  },
  dayCellSelected: {
    backgroundColor: THEME.colors.surfaceHigh,
    borderColor: THEME.colors.primary,
  },
  dayCellFuture: {
    opacity: 0.35,
  },
  dayNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  dayNumberCircleToday: {
    borderColor: THEME.colors.primary,
  },
  dayNumberCircleSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  amountText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  amountPlaceholder: {
    height: 12,
  },
});

export const HistoryCalendar = memo(HistoryCalendarComponent);
