import { memo, useCallback, useRef } from "react";
import { THEME } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PB_SCREEN } from "../../constants/padding";
import { ScrollViewCTProps } from "./type";
import { ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native";
import { checkAndResetSkipScrollToTop } from "../../utils/navigationScrollHelper";

const Scroll = memo(
  ({
    isScreen = false,
    children,
    contentContainerStyle,
    isKeyboardAwareScrollView,
    ...props
  }: ScrollViewCTProps) => {
    const { bottom } = useSafeAreaInsets();
    const scrollRef = useRef<any>(null);
    useScrollToTop(scrollRef);

    // Scroll to top whenever this screen gains focus (unless returning from child screens like detail)
    useFocusEffect(
      useCallback(() => {
        if (!isScreen) return;
        if (checkAndResetSkipScrollToTop()) return;

        const current = scrollRef.current;
        if (!current) return;

        if (typeof current.scrollTo === "function") {
          current.scrollTo({ y: 0, animated: false });
        } else if (typeof current.scrollToPosition === "function") {
          current.scrollToPosition(0, 0, false);
        } else if (typeof current.scrollToOffset === "function") {
          current.scrollToOffset({ offset: 0, animated: false });
        } else if (typeof current.getScrollResponder === "function") {
          const responder = current.getScrollResponder();
          if (typeof responder?.scrollTo === "function") {
            responder.scrollTo({ y: 0, animated: false });
          }
        }
      }, [isScreen]),
    );

    const Component = isKeyboardAwareScrollView
      ? KeyboardAwareScrollView
      : ScrollView;
    return (
      <Component
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
