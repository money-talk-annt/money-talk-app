import { ViewProps } from "react-native";
import { COLORS } from "../../theme/colors";
import { ReactNode } from "react";



export interface CardProps extends ViewProps{
    title: string;
    description: string;
    money: number;
    icon: ReactNode;
    bgColor?: keyof typeof COLORS;
    color?: keyof typeof COLORS;
}