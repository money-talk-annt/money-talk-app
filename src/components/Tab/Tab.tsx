import { memo, useEffect, useRef } from "react";
import { TabProps } from "./type";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import Text from "../Text";
import { THEME } from "../../theme";
import Box from "../Box";

function TabComponent<T extends string>({
  items,
  value,
  onChange,
  containerStyle,
  tabStyle,
  indicatorStyle,
  labelStyle,
}: TabProps<T>) {
  const translateX = useRef(new Animated.Value(0)).current;

  const activeIndex = items.findIndex((item) => item.value === value);

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeIndex,
      useNativeDriver: true,
    }).start();
  }, [activeIndex]);

  return (
    <Box p="sm" bgColor="surfaceHigh" radius="xl">
      <View
        style={[styles.container, containerStyle]}
        onLayout={(e) => {
          width.current = e.nativeEvent.layout.width;
        }}
      >
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            {
              width: `${100 / items.length}%`,
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: items.map((_, i) => i),
                    outputRange: items.map(
                      (_, i) => i * (width.current / items.length),
                    ),
                  }),
                },
              ],
            },
          ]}
        />

        {items.map((item) => (
          <Pressable
            key={item.value}
            style={[styles.tab, tabStyle]}
            onPress={() => onChange(item.value)}
          >
            <Text
              style={[labelStyle]}
              type="bodyMd"
              color={value === item.value ? "white" : "text"}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Box>
  );
}

const width = { current: 0 };

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.surfaceHigh,
    flexDirection: "row",
    position: "relative",
    overflow: "hidden",
  },

  indicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#4F46E5",
    borderRadius: 24,
  },

  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const Tab = memo(TabComponent) as typeof TabComponent;
