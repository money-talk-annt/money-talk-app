import { ComponentProps, ReactNode } from "react";
import { PressableProps, TouchableOpacityProps } from "react-native";
import {Ionicons} from '@expo/vector-icons'


export interface QuickActionProps extends TouchableOpacityProps {
  suffix?: ComponentProps<typeof Ionicons>["name"];
  children?: ReactNode;
  prefix?: ComponentProps<typeof Ionicons>["name"];
  isActive?: boolean;
  size?: "sm" | "md";
}
