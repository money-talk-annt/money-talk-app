import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PATHNAME } from "../../constants/pathname";

const useDashboard = () => {
  const { t } = useTranslation("dashboard");
  const [isExpense, setIsExpense] = useState(true);
  const navigation = useNavigation<AppNavigation>();

  const { height } = useWindowDimensions();

  const handlePressQuickAction = (value: boolean) => {
    return () => {
      if (value === isExpense) return;
      setIsExpense(value);
    };
  };

  const handleNavigateToHistory = () => {
  navigation.navigate(PATHNAME.HISTORY);
};

  return { t, height, isExpense, handlePressQuickAction, handleNavigateToHistory };
};

export { useDashboard };
