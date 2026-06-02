import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { BoxProps } from "../Box/type";

export interface TransactionProps extends BoxProps {
  icon?: ComponentProps<typeof Ionicons>["name"];
  name?: string;
  category?: string;
  time?: Date | string;
  typeTrasaction?: "income" | "expense";
  money?: number;
  onPress?: () => void;
}
