import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Transaction from "../screens/Transaction";
import Analysis from "../screens/Analysis";
import Profile from "../screens/Profile";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../theme";
import Dashboard from "../screens/Dashboard";

const BottomTab = createBottomTabNavigator({
  screenOptions: {
    headerTintColor: THEME.colors.primary,
    headerTitleStyle: {
      fontSize: 24,
      fontWeight: "700",
    },
  },
  screens: {
    Dashboards: {
      screen: Dashboard,
      options: {
        headerShown: false,
        tabBarLabel: "Dashboard",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      },
    },
    Transactions: {
      screen: Transaction,
      options: {
        headerShown: false,
        tabBarLabel: "History",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="book-outline" size={size} color={color} />
        ),
      },
    },
    Analytics: {
      screen: Analysis,
      options: {
        headerShown: false,
        tabBarLabel: "Analytics",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="analytics" size={size} color={color} />
        ),
      },
    },
    Profile: {
      screen: Profile,
      options: {
        headerShown: false,
        tabBarLabel: "Profile",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
      },
    },
  },
});

export { BottomTab };
