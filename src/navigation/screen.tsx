import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTab } from "./bottom";
import Transaction from "../screens/Transaction";
import { RootStackParamList } from "./type";
import TransactionDetail from "../screens/TransactionDetail";

const RootStack = createNativeStackNavigator<RootStackParamList>({
  screens: {
    Home: {
      options: {
        headerShown: false,
      },
      screen: BottomTab,
    },
    TransactionRoot: {
      screen: Transaction,
      options: {
        presentation: "modal",
      },
    },
    TransactionDetail: {
      screen: TransactionDetail,
      options: {
        headerBackButtonDisplayMode: "minimal",
      },
    },
  },
});

export { RootStack };
