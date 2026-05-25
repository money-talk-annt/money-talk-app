import { TextProps } from "react-native";
import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";

export interface MyTextProps extends TextProps{
    color?: keyof typeof COLORS;
    type?: keyof typeof TYPOGRAPHY;
    align?: "left" | "center" | "right";
} 