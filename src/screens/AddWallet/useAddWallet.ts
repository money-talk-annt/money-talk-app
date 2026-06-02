import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import { useAddWalletForm } from "./useAddWalletForm";
import { useCallback, useLayoutEffect, useState } from "react";
import i18n from "../../i18n";
import { CURRENCY } from "../../constants/currencey";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { walletRepo } from "../../database/repository/wallet";

export const useAddWallet = () => {
  const { t } = useTranslation("addWallet");
  const navigation = useNavigation<AppNavigation>();
  const { height } = useWindowDimensions();
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    watch,
    reset,
  } = useAddWalletForm(t);
  const [ballance, setBallance] = useState<number>(0);
  const { bottom } = useSafeAreaInsets();

  const language = i18n.language;

  const currency = CURRENCY[language as keyof typeof CURRENCY].currency;

  const handleSubmitForm = useCallback(
    handleSubmit(({ walletName, balance, color, icon }) => {
      let newBalance = balance?.replaceAll(".", "");
      newBalance = newBalance?.replaceAll(",", ".");
      walletRepo.add(walletName, Number(newBalance) || 0, color, icon);
      reset();
    }),
    [],
  );

  const colorIcon = watch("color");
  const walletName = watch("walletName");

  const handleOnChangeBallance = useCallback((text: string) => {
    let newBalance = text?.replaceAll(".", "");
    newBalance = newBalance?.replaceAll(",", ".");

    setBallance(Number(newBalance) ?? 0);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("title"),
    });
  }, [navigation, t]);

  return {
    t,
    height,
    navigation,
    control,
    currency,
    colorIcon,
    ballance,
    isValid,
    isSubmitting,
    walletName,
    handleSubmitForm,
    handleOnChangeBallance,
  };
};
