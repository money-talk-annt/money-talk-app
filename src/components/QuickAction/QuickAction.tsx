import { TouchableOpacity } from "react-native";
import Box from "../Box";
import { QuickActionProps } from "./type";
import Flex from "../Flex/Flex";
import Text from "../Text";
import { COLORS } from "../../theme/colors";
import { memo, useMemo } from "react";
import { SPACING } from "../../theme/spacing";
import { Ionicons } from "@expo/vector-icons";

const QuickActionComponent = ({
  children,
  suffix,
  prefix,
  isActive,
  size = "sm",
  onPress,
  style,
  ...props
}: QuickActionProps) => {
  const textColor: keyof typeof COLORS = isActive ? "white" : "textPrimary";
  const bgColor: keyof typeof COLORS = isActive
    ? "primary"
    : "quickActionUnActive";

  const { px, py } = useMemo<Record<string, keyof typeof SPACING>>(() => {
    return {
      px: size === "md" ? "xl" : "md",
      py: size === "md" ? "md" : "sm",
    };
  }, [size]);

  return (
    <TouchableOpacity style={[{ flex: 1 }, style]} onPress={onPress} {...props}>
      <Box py={py} bgColor={bgColor} style={{}} radius="lg">
        <Flex justify="center" gap={8} align="center">
          {prefix && (
            <Ionicons color={COLORS[textColor]} name={prefix} size={20} />
          )}
          <Text color={textColor} type="labelMd">
            {children}
          </Text>
          {suffix && (
            <Ionicons color={COLORS[textColor]} name={suffix} size={20} />
          )}
        </Flex>
      </Box>
    </TouchableOpacity>
  );
};

const QuickAction = memo(QuickActionComponent);

export { QuickAction };
