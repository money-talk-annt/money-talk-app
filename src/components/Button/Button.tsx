import { memo } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import Text from "../Text";
import { THEME } from "../../theme";
import { ButtonProps } from "./type";

const Button = memo(
  ({ title, loading = false, disabled, style, ...props }: ButtonProps) => {
    const isDisabled = disabled || loading;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isDisabled}
        style={[
          {
            paddingVertical: THEME.spacing.container,
            borderRadius: THEME.radius.lg,
            alignItems: "center",
            backgroundColor: THEME.colors.primary,
            opacity: isDisabled ? 0.6 : 1,
          },
          style,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={THEME.colors.white} />
        ) : (
          <Text type="bodyMd" color="white">
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  },
);

export { Button };
