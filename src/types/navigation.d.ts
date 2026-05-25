import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RouteName = typeof PATHNAME[keyof typeof PATHNAME];

type RootStackParamList = Record<RouteName, undefined>;

declare global {
  type AppNavigation = NativeStackNavigationProp<RootStackParamList>;
}