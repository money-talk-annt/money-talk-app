import { memo } from "react";
import { THEME } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PB_SCREEN } from "../../constants/padding";
import { ScrollViewCTProps } from "./type";
import { ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Scroll = memo(
  ({
    isScreen = false,
    children,
    contentContainerStyle,
    isKeyboardAwareScrollView,
    ...props
  }: ScrollViewCTProps) => {
    const { bottom } = useSafeAreaInsets();
    const Component = isKeyboardAwareScrollView
      ? KeyboardAwareScrollView
      : ScrollView;
    return (
      <Component
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          isScreen && {
            paddingHorizontal: THEME.spacing.container,
            paddingBottom: bottom,
          },
          contentContainerStyle,
        ]}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

export { Scroll };
