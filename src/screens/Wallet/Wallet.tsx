import { memo } from "react";
import Box from "../../components/Box";
import Text from "../../components/Text";
import { useWallet } from "./useWallet";
import { ScrollView } from "react-native";
import { formatCurrency } from "../../utils/formatCurrency";
import Flex from "../../components/Flex/Flex";
import { IconName, icons } from "../../assets/icons";
import { THEME } from "../../theme";
import { withOpacity } from "../../utils/opacity";

const Wallet = memo(() => {
  const { t, datas, totalMoney } = useWallet();

  return (
    <Box bgColor="background" style={{ flex: 1 }}>
      <ScrollView
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
          <Text type="bodyLg" color="textWhiteGray">
            {t("total")}
          </Text>
          <Text type="headlineLg" color="white">
            {formatCurrency(totalMoney)}
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
                <Flex gap={12}>
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

                  <Flex direction="column" justify="center">
                    <Text type="bodyLgBold">{item.name}</Text>
                    <Text type="bodyMd">{formatCurrency(item.balance)}</Text>
                  </Flex>
                </Flex>
              </Box>
            );
          })}
        </Flex>
      </ScrollView>
    </Box>
  );
});

export { Wallet };
