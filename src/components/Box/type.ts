import { ReactNode } from "react";
import { COLORS } from "../../theme/colors";
import { SPACING } from "../../theme/spacing";
import { RADIUS } from "../../theme/radius";
import { SHADOW } from "../../theme/shadow";
import { ViewProps } from "react-native";
import { StyleProps } from "react-native-reanimated";

export interface BoxProps extends ViewProps {
  children?: ReactNode;
  px?: keyof typeof SPACING;
  py?: keyof typeof SPACING;
  pl?: keyof typeof SPACING;
  pr?: keyof typeof SPACING;
  pt?: keyof typeof SPACING;
  pb?: keyof typeof SPACING;
  mx?: keyof typeof SPACING;
  my?: keyof typeof SPACING;
  ml?: keyof typeof SPACING;
  mr?: keyof typeof SPACING;
  mt?: keyof typeof SPACING;
  mb?: keyof typeof SPACING;
  m?: keyof typeof SPACING;
  p?: keyof typeof SPACING;
  bgColor?: keyof typeof COLORS;
  radius?: keyof typeof RADIUS;
  shadow?: keyof typeof SHADOW;
}
