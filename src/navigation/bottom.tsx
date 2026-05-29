import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Transaction from "../screens/Transaction";
import Analysis from "../screens/Analysis";
import { Ionicons } from "@expo/vector-icons";
import Dashboard from "../screens/Dashboard";
import { DashboardNested, ProfileNested } from "./nested";

const BottomTab = createBottomTabNavigator({
  screens: {
    Dashboards: {
      screen: DashboardNested,
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
        headerShown: true,
        tabBarLabel: "History",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="book-outline" size={size} color={color} />
        ),
      },
    },
    Analytics: {
      screen: Analysis,
      options: {
        headerShown: true,
        tabBarLabel: "Analytics",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="analytics" size={size} color={color} />
        ),
      },
    },
    Profile: {
      screen: ProfileNested,
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
