import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import History from "../screens/History";
import Analysis from "../screens/Analysis";
import { Ionicons } from "@expo/vector-icons";
import { DashboardNested, ProfileNested } from "./nested";
import { THEME } from "../theme";
import { ActionSheetIOS, Alert, Platform, View } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import { PATHNAME } from "../constants/pathname";
import { RootTabParamList } from "./type";
import Text from "../components/Text";
import { useTranslation } from "react-i18next";

const TabBarLabel = ({
  labelKey,
  fallback,
  color,
}: {
  labelKey: string;
  fallback: string;
  color: string;
}) => {
  const { t } = useTranslation("common");
  return (
    <Text
      style={{
        color,
        fontSize: 11,
        fontWeight: "600",
        marginTop: -2,
      }}
    >
      {t(labelKey as any) || fallback}
    </Text>
  );
};

const AddTransactionButton = ({ navigation, ...props }: any) => {
  const { t } = useTranslation("common");

  const showAddTransactionOptions = () => {
    const title = t("addTransaction.title") || "Thêm giao dịch";
    const regularText = t("addTransaction.regular") || "📝 Thêm thường";
    const photoText = t("addTransaction.photo") || "📸 Chụp ảnh (Locket)";
    const cancelText = t("addTransaction.cancel") || "Hủy";

    const handleSelection = (index: number) => {
      if (index === 0) {
        navigation.getParent()?.navigate(PATHNAME.TRANSACTION_ROOT);
      } else if (index === 1) {
        navigation.getParent()?.navigate(PATHNAME.LOCKET_CAMERA);
      }
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [regularText, photoText, cancelText],
          cancelButtonIndex: 2,
          title,
        },
        handleSelection,
      );
    } else {
      Alert.alert(title, undefined, [
        {
          text: regularText,
          onPress: () => handleSelection(0),
        },
        {
          text: photoText,
          onPress: () => handleSelection(1),
        },
        {
          text: cancelText,
          style: "cancel",
        },
      ]);
    }
  };

  return (
    <PlatformPressable
      {...props}
      onPress={showAddTransactionOptions}
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
};

const BottomTab = createBottomTabNavigator<RootTabParamList>({
  screens: {
    Dashboards: {
      screen: DashboardNested,
      options: {
        headerShown: false,
        tabBarLabel: ({ color }) => (
          <TabBarLabel
            labelKey="bottomNav.dashboard"
            fallback="Dashboard"
            color={color}
          />
        ),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      },
    },
    History: {
      screen: History,
      options: {
        headerShown: false,
        tabBarLabel: ({ color }) => (
          <TabBarLabel
            labelKey="bottomNav.history"
            fallback="History"
            color={color}
          />
        ),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="book-outline" size={size} color={color} />
        ),
      },
    },
    Transaction: {
      screen: View,
      options: ({ navigation }) => ({
        headerShown: false,
        tabBarButton: (props) => (
          <AddTransactionButton {...props} navigation={navigation} />
        ),
      }),
    },
    Analytics: {
      screen: Analysis,
      options: {
        headerShown: false,
        tabBarLabel: ({ color }) => (
          <TabBarLabel
            labelKey="bottomNav.analytics"
            fallback="Analytics"
            color={color}
          />
        ),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="analytics" size={size} color={color} />
        ),
      },
    },
    Profile: {
      screen: ProfileNested,
      options: {
        headerShown: false,
        tabBarLabel: ({ color }) => (
          <TabBarLabel
            labelKey="bottomNav.profile"
            fallback="Profile"
            color={color}
          />
        ),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
        popToTopOnBlur: true,
      },
    },
  },
});

export { BottomTab };
