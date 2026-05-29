import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Wallet from "../screens/Wallet";
import AddWallet from "../screens/AddWallet";
import Profile from "../screens/Profile";
import { THEME } from "../theme";
import DashBoard from "../screens/Dashboard";
import HeaderRight from "../components/HeaderRight";
import { PATHNAME } from "../constants/pathname";

export const ProfileNested = createNativeStackNavigator({
  initialRouteName: "ProfileStack",
  screenOptions: {
    headerTintColor: THEME.colors.primary,
    headerTitleStyle: THEME.typography.headlineMd,
    headerBackButtonDisplayMode: "minimal",
  },
  screens: {
    Wallet: {
      screen: Wallet,
      options: () => ({
        headerRight: () => <HeaderRight pathname={PATHNAME.ADDWALLET} />,
      }),
    },
    AddWallet: {
      screen: AddWallet,
      options: {
        headerShown: true,
      },
    },
    ProfileStack: {
      screen: Profile,
    },
  },
});

export const DashboardNested = createNativeStackNavigator({
  screenOptions: {
    headerTintColor: THEME.colors.primary,
    headerTitleStyle: THEME.typography.headlineMd,
  },
  screens: {
    DashboardStack: {
      screen: DashBoard,
      options: {
        headerTitle: "Money Talk",
      },
    },
  },
});
