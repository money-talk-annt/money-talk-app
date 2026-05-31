import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { PATHNAME } from "../../constants/pathname";

const useDashboard = () => {
  const { t } = useTranslation("dashboard");
  const [isExpense, setIsExpense] = useState(true);
  const navigation = useNavigation<AppNavigation>();

  const handlePressQuickAction = (value: boolean) => {
    return () => {
      if (value === isExpense) return;
      setIsExpense(value);
    };
  };

  const handleNavigateToHistory = () => {
  navigation.navigate(PATHNAME.HISTORY);
};

  return { t, isExpense, handlePressQuickAction, handleNavigateToHistory };
};

export { useDashboard };
