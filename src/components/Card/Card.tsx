import { memo } from "react";
import { CardProps } from "./type";
import Box from "../Box";
import Flex from "../Flex/Flex";
import Text from "../Text";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { COLORS } from "../../theme/colors";
import { THEME } from "../../theme";
import { formatCurrency } from "../../utils/formatCurrency";

const CardComponent = ({
  title,
  description,
  money,
  icon,
  bgColor = "primaryContainer",
  style,
  color = "card",
  isFull = false,
  onPress,
}: CardProps) => {
  const { width } = useWindowDimensions();
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        bgColor={bgColor}
        radius="xl"
        p="md"
        style={[
          {
            width: width * (isFull ? 1 : 0.7) - THEME.spacing.container * 2,
            padding: THEME.spacing.md,
          },
          style,
        ]}
      >
        <Flex align="center" gap={5}>
          {icon}
          <Text type="labelSm" color={color}>
            {title}
          </Text>
        </Flex>

        <Box style={{ height: 48, backgroundColor: "transparent" }} />

        <Text color={color} type="labelSm">
          {description}
        </Text>
        <Text color={color} type="headlineMd">
          {formatCurrency(money)}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

const Card = memo(CardComponent);

export default Card;
