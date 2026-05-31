import { CompositeNavigationProp, NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootTabParamList } from "../navigation/type";

type RootStackParamList = {
  Home: NavigatorScreenParams<RootTabParamList>;
  TransactionRoot: undefined;
};

declare global {
  type AppNavigation = CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >;
}