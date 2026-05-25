import { Platform } from "react-native";

export const SHADOW = {
  level1: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 4 },
    },
    android: {
      elevation: 2,
    },
  }),

  level2: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 30,
      shadowOffset: { width: 0, height: 10 },
    },
    android: {
      elevation: 6,
    },
  }),
} as const;
