import { View, type StyleProp, type ViewStyle } from "react-native";
import { BoxProps } from "./type";
import { SPACING } from "../../theme/spacing";
import { COLORS } from "../../theme/colors";
import { RADIUS } from "../../theme/radius";
import { SHADOW } from "../../theme/shadow";
import { memo } from "react";

const BoxComponent = ({
  children,
  px,
  py,
  pl,
  pr,
  pt,
  pb,
  bgColor = "transparent",
  mx,
  my,
  ml,
  mr,
  mt,
  mb,
  p,
  m,
  radius,
  shadow,
  style: styleProp,
  ...props
}: BoxProps) => {
  return (
    <View
      style={[
        {
          ...(p && { padding: SPACING[p] }),
          ...(px && { paddingHorizontal: SPACING[px] }),
          ...(py && { paddingVertical: SPACING[py] }),
          ...(pl && { paddingLeft: SPACING[pl] }),
          ...(pr && { paddingRight: SPACING[pr] }),
          ...(pt && { paddingTop: SPACING[pt] }),
          ...(pb && { paddingBottom: SPACING[pb] }),
          ...(m && { margin: SPACING[m] }),
          ...(mx && { marginHorizontal: SPACING[mx] }),
          ...(my && { marginVertical: SPACING[my] }),
          ...(ml && { marginLeft: SPACING[ml] }),
          ...(mr && { marginRight: SPACING[mr] }),
          ...(mt && { marginTop: SPACING[mt] }),
          ...(mb && { marginBottom: SPACING[mb] }),
          backgroundColor: COLORS[bgColor],
          borderRadius: radius ? RADIUS[radius] : undefined,
          ...(shadow ? SHADOW[shadow] : undefined),
        },
        styleProp,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const Box = memo(BoxComponent);

export { Box };
