import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootTabParamList } from "../navigation/type";

declare global {
  type RootStackParamList = {
    Home: NavigatorScreenParams<RootTabParamList>;
    TransactionRoot: undefined;
    TransactionDetail: { id: number };
  };

  type AppNavigation = CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >;
}
