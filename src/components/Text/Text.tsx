import { memo } from "react";
import { MyTextProps } from "./type";
import { Text as DefaultText, TextStyle } from "react-native";
import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";

const TextComponent = ({
  children,
  color = "text",
  type = "labelMd",
  align = "left",
  style,
  ...props
}: MyTextProps) => {
  const textStyle = TYPOGRAPHY[type] as TextStyle;
  return (
    <DefaultText
      style={[
        {
          backgroundColor: "transparent",
          color: COLORS[color],
          textAlign: align,
          ...textStyle,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

const Text = memo(TextComponent);

export { Text };
