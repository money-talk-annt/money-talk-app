import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTab } from "./bottom";
import { THEME } from "../theme";
import Wallet from "../screens/Wallet";
import AddWallet from "../screens/AddWallet";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@react-navigation/elements";

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      options: {
        headerShown: false,
      },
      screen: BottomTab,
    },
  },
});

export { RootStack };
