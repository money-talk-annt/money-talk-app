import React, { memo } from "react";
import {
  Pressable,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import Box from "../../components/Box";
import { useDashboard } from "./useDashboard";
import Flex from "../../components/Flex/Flex";
import Text from "../../components/Text";
import Card from "../../components/Card/Card";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../theme";
import QuickAction from "../../components/QuickAction";
import { formatCurrency } from "../../utils/formatCurrency";
import { Transaction } from "../../components/Transaction/Transaction";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function DashboardScreen() {
  const {
    t,
    handlePressQuickAction,
    isExpense,
    height,
    handleNavigateToHistory,
  } = useDashboard();
  const insets = useSafeAreaInsets();
  return (
    <Box bgColor="background" style={{ height: height}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: THEME.spacing.container,
          paddingBottom: insets.bottom + 150,
        }}
      >
        <Box pt="xl" pb="gutter">
          <Flex direction="column">
            <Text align="center" type="labelMd">
              {t("totalBalance")}
            </Text>
            <Text align="center" type="displayLg">
              {formatCurrency(12450)}
            </Text>
          </Flex>
        </Box>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            width: "100%",
          }}
          contentContainerStyle={{
            gap: 12,
          }}
        >
          <Card
            bgColor="primaryContainer"
            title={t("bank")}
            icon={
              <Ionicons
                name="business-outline"
                size={24}
                color={THEME.colors.card}
              />
            }
            description={t("availableFunds")}
            money={500000}
          />

          <Card
            bgColor="surfaceHigh"
            color="text"
            title={t("cash")}
            icon={
              <Ionicons
                name="cash-outline"
                size={24}
                color={THEME.colors.secondary}
              />
            }
            description={t("totalCash")}
            money={500000}
          />

          <Card
            bgColor="surfaceLow"
            color="text"
            title={t("eWallet")}
            icon={
              <Ionicons
                name="wallet-outline"
                size={24}
                color={THEME.colors.expense}
              />
            }
            description={t("balance")}
            money={500000}
          />
        </ScrollView>

        <Box pb="lg" pt="40">
          <Flex justify="space-between" gap={12}>
            <QuickAction
              onPress={handlePressQuickAction(true)}
              prefix="remove-outline"
              size="md"
              isActive={isExpense}
            >
              {t("addExpense")}
            </QuickAction>

            <QuickAction
              onPress={handlePressQuickAction(false)}
              prefix="add-outline"
              size="md"
              isActive={!isExpense}
            >
              {t("addIncome")}
            </QuickAction>
          </Flex>
        </Box>

        <Flex justify="space-between" align="center">
          <Text type="bodyMd">{t("recentActivity")}</Text>

          <TouchableOpacity onPress={handleNavigateToHistory}>
            <Text type="labelMd" color="textPrimary">
              {t("seeAll")}
            </Text>
          </TouchableOpacity>
        </Flex>

        <Box pt="md" pb="container">
          <Flex direction="column" gap={8}>
            <Transaction
              icon="fast-food-outline"
              name="Bánh cuốn Bánh cuốn Bánh cuốn Bánh cuốn"
              category="Ăn uống"
              typeTrasaction="income"
              money={300000000}
            />

            <Transaction
              icon="fast-food-outline"
              name="Bánh cuốn"
              category="Ăn uống"
              typeTrasaction="expense"
              money={30000}
              time={new Date(Date.now() - 86400000)}
            />

            <Transaction
              icon="fast-food-outline"
              name="Bánh cuốn"
              category="Ăn uống"
              typeTrasaction="expense"
              money={30000}
              time={new Date("2025-10-24")}
            />
          </Flex>
        </Box>
      </ScrollView>
    </Box>
  );
}

const DashBoard = memo(DashboardScreen);
export default DashBoard;
