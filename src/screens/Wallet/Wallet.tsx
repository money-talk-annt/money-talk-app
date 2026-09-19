import { memo } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Box from "../../components/Box";
import Text from "../../components/Text";
import { useWallet } from "./useWallet";
import { formatCurrency } from "../../utils/formatCurrency";
import Flex from "../../components/Flex/Flex";
import { IconName, icons } from "../../assets/icons";
import { THEME } from "../../theme";
import { withOpacity } from "../../utils/opacity";
import { Scroll } from "../../components/ScrollView/ScrollView";

const Wallet = memo(() => {
  const {
    t,
    datas,
    totalMoney,
    isBalanceVisible,
    toggleBalanceVisibility,
    handleEditWallet,
    handleDeleteWallet,
  } = useWallet();

  const isOnlyOneWallet = (datas?.length ?? 0) <= 1;

  return (
    <Box bgColor="background" style={{ flex: 1 }}>
      <Scroll
        isScreen
        contentContainerStyle={{
          paddingHorizontal: THEME.spacing.md,
        }}
      >
        <Box
          mt="lg"
          mb="container"
          p="lg"
          bgColor="primaryContainer"
          radius="lg"
        >
          <Flex justify="space-between" align="center">
            <Text type="bodyLg" color="textWhiteGray">
              {t("total")}
            </Text>
            <TouchableOpacity
              onPress={toggleBalanceVisibility}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isBalanceVisible ? "eye-outline" : "eye-off-outline"}
                size={22}
                color={THEME.colors.textWhiteGray}
              />
            </TouchableOpacity>
          </Flex>
          <Text type="headlineLg" color="white" style={{ marginTop: 4 }}>
            {isBalanceVisible ? formatCurrency(totalMoney) : "•••••••• ₫"}
          </Text>
        </Box>

        <Text style={{ marginBottom: 6 }} type="headlineMd">
          {t("allWallet")}
        </Text>

        <Flex direction="column" gap={12}>
          {datas?.map((item) => {
            const Component = icons[(item.icon ?? "bag") as IconName];

            if (!Component) return null;

            return (
              <Box
                key={item.id}
                bgColor="white"
                shadow="level2"
                p="md"
                radius="lg"
              >
                <Flex justify="space-between" align="center">
                  <Flex gap={12} align="center" style={{ flex: 1 }}>
                    <Box
                      p="md"
                      radius="full"
                      style={{
                        backgroundColor: withOpacity(0.1, item.color),
                      }}
                    >
                      <Component
                        height={23}
                        width={23}
                        stroke={item.color ?? THEME.colors.primary}
                        fill={item.color}
                      />
                    </Box>

                    <Flex direction="column" justify="center" style={{ flex: 1 }}>
                      <Text type="bodyLgBold" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text type="bodyMd">
                        {isBalanceVisible ? formatCurrency(item.balance) : "•••••••• ₫"}
                      </Text>
                    </Flex>
                  </Flex>

                  {/* Actions: Edit & Delete */}
                  <Flex align="center" gap={8}>
                    <TouchableOpacity
                      onPress={() => handleEditWallet(item)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: THEME.radius.full,
                        backgroundColor: withOpacity(0.08, THEME.colors.primary),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      activeOpacity={0.7}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={17}
                        color={THEME.colors.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteWallet(item)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: THEME.radius.full,
                        backgroundColor: withOpacity(
                          0.08,
                          isOnlyOneWallet
                            ? THEME.colors.textSecondary
                            : THEME.colors.expense,
                        ),
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: isOnlyOneWallet ? 0.4 : 1,
                      }}
                      activeOpacity={0.7}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color={
                          isOnlyOneWallet
                            ? THEME.colors.textSecondary
                            : THEME.colors.expense
                        }
                      />
                    </TouchableOpacity>
                  </Flex>
                </Flex>
              </Box>
            );
          })}
        </Flex>
      </Scroll>
    </Box>
  );
});

export { Wallet };
