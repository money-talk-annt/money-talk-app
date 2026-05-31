import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import History from "../screens/Transaction";
import Analysis from "../screens/Analysis";
import { Ionicons } from "@expo/vector-icons";
import { DashboardNested, ProfileNested } from "./nested";
import { THEME } from "../theme";
import { View } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import { PATHNAME } from "../constants/pathname";
import { RootTabParamList } from "./type";

const BottomTab = createBottomTabNavigator<RootTabParamList>({
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
    History: {
      screen: History,
      options: {
        headerShown: true,
        tabBarLabel: "History",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="book-outline" size={size} color={color} />
        ),
      },
    },
    Transaction: {
      screen: View,
      options: ({navigation}) => ({
        headerShown: false,
        tabBarButton: (props) => {
          return (
            <PlatformPressable
              {...props}
              onPress={() => {
                navigation.getParent()?.navigate(PATHNAME.TRANSACTION_ROOT);
              }}
              style={{
                top: -20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: THEME.radius.full,
                  backgroundColor: THEME.colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 5,
                }}
              >
                <Ionicons name="add" size={32} color={THEME.colors.white} />
              </View>
            </PlatformPressable>
          );
        },
      }),
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
