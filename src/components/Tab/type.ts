import { ViewStyle } from "react-native";
import { BoxProps } from "../Box/type";
import { MyTextProps } from "../Text/type";

export type TabItem<T extends string> = {
  label: string;
  value: T;
};

export interface TabProps<T extends string>{
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;

  containerStyle?: ViewStyle;
  tabStyle?: BoxProps;
  indicatorStyle?: BoxProps;
  labelStyle?: MyTextProps;
  activeLabelStyle?: MyTextProps;
};