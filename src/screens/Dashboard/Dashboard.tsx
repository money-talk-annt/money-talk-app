import React, { memo } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
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
import { Scroll } from "../../components/ScrollView/ScrollView";
import { IconName, icons } from "../../assets/icons";
import { withOpacity } from "../../utils/opacity";
import { I18N_CATEGORY_KEY } from "../../constants/categoryIcon";
import { mapI18n } from "../../utils/mapI18n";

function DashboardScreen() {
  const {
    t,
    tCommon,
    isExpense,
    transactions,
    wallets,
    totalBalance,
    handlePressQuickAction,
    handleNavigateToHistory,
    handleClickTransaction,
  } = useDashboard();
  return (
    <Box bgColor="background" style={{ flex: 1 }}>
      <Scroll isScreen>
        <Box pt="xl" pb="gutter">
          <Flex direction="column">
            <Text align="center" type="labelMd">
              {t("totalBalance")}
            </Text>
            <Text align="center" type="displayLg">
              {formatCurrency(totalBalance)}
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
          {wallets.map((item) => {
            const ComponentIcon = icons[(item.icon || "cash") as IconName];
            return (
              <Card
                key={item.id}
                color="text"
                title={item.name}
                icon={
                  <ComponentIcon height={24} width={24} stroke={item.color} />
                }
                description={t("totalCash")}
                money={item.balance}
                isFull={wallets.length === 1}
                style={{
                  backgroundColor: withOpacity(
                    0.2,
                    item.color || THEME.colors.primary,
                  ),
                }}
              />
            );
          })}
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
            {transactions.map((item) => {
              return (
                <Transaction
                  onPress={() => handleClickTransaction(item.id)}
                  key={item.id}
                  icon="fast-food-outline"
                  name={tCommon(mapI18n(item.category))}
                  category={item.walletName}
                  typeTrasaction={item.type}
                  money={item.amount}
                  time={item.transactionDate}
                />
              );
            })}
          </Flex>
        </Box>
      </Scroll>
    </Box>
  );
}

const DashBoard = memo(DashboardScreen);
export default DashBoard;
