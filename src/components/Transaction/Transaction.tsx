import { memo, useMemo } from "react";
import Box from "../Box";
import Flex from "../Flex/Flex";
import { TransactionProps } from "./type";
import { Ionicons } from "@expo/vector-icons";
import Text from "../Text";
import { formatTransactionDate } from "../../utils/formatTransactionDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { COLORS } from "../../theme/colors";

const TransactionComponent = ({
  icon,
  name,
  category,
  time = new Date(),
  typeTrasaction,
  money = 0,
  bgColor = "card",
  ...props
}: TransactionProps) => {
  const { color, prefix } = useMemo(() => {
    return {
      prefix: typeTrasaction === "expense" ? "-" : "+",
      color:
        typeTrasaction === "expense"
          ? "secondary"
          : ("error" as keyof typeof COLORS),
    };
  }, [typeTrasaction]);
  return (
    <Box p="md" bgColor={bgColor} {...props}>
      <Flex align="center" justify="space-between" gap={4}>
        <Flex gap={16} align="center" style={{ flex: 1 }}>
          <Box px="md" py="14" radius="md" bgColor="bgSecondary">
            <Ionicons name={icon} size={32} color={COLORS.secondary} />
          </Box>

          <Box style={{ flex: 1 }}>
            <Text numberOfLines={1} type="bodyMdBold" color="textSecondary">
              {name}
            </Text>
            <Text numberOfLines={1} type="labelSm" color="textSecondary">
              {`${category} • ${formatTransactionDate(time)}`}
            </Text>
          </Box>
        </Flex>

        <Text numberOfLines={1} type="labelMdBold" color={color}>
          {`${prefix} ${formatCurrency(money)}`}
        </Text>
      </Flex>
    </Box>
  );
};

const Transaction = memo(TransactionComponent);

export { Transaction };
