import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTab } from "./bottom";
import Transaction from "../screens/Transaction";
import { RootStackParamList } from "./type";
import TransactionDetail from "../screens/TransactionDetail";
import Wallet from "../screens/Wallet";
import AddWallet from "../screens/AddWallet";
import HeaderRight from "../components/HeaderRight";
import { PATHNAME } from "../constants/pathname";

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
    Wallet: {
      screen: Wallet,
      options: () => ({
        headerBackButtonDisplayMode: "minimal",
        headerRight: () => <HeaderRight pathname={PATHNAME.ADDWALLET} />,
      }),
    },
    AddWallet: {
      screen: AddWallet,
      options: {
        headerBackButtonDisplayMode: "minimal",
      },
    },
  },
});

export { RootStack };
