import { useTranslation } from "react-i18next";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import { useAddWalletForm } from "./useAddWalletForm";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import i18n from "../../i18n";
import { CURRENCY } from "../../constants/currencey";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { walletRepo } from "../../database/repository/wallet";
import { formatCurrencyInput } from "../../utils/formatCurrency";
import { THEME } from "../../theme";

export const useAddWallet = () => {
  const { t } = useTranslation("addWallet");
  const navigation = useNavigation<AppNavigation>();
  const route = useRoute<RouteProp<RootStackParamList, "AddWallet">>();
  const walletId = route.params?.walletId;
  const isEditMode = Boolean(walletId);

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

  useEffect(() => {
    if (walletId) {
      const wallet = walletRepo.getById(walletId);
      if (wallet) {
        const formattedBalance = formatCurrencyInput(String(wallet.balance));
        reset({
          walletName: wallet.name,
          balance: formattedBalance,
          color: wallet.color ?? THEME.colors.primary,
          icon: (wallet.icon as any) ?? "bag",
        });
        setBallance(wallet.balance);
      }
    }
  }, [walletId, reset]);

  const handleSubmitForm = useCallback(
    handleSubmit(({ walletName, balance, color, icon }) => {
      let newBalance = balance?.replaceAll(".", "");
      newBalance = newBalance?.replaceAll(",", ".");
      const numericBalance = Number(newBalance) || 0;

      if (isEditMode && walletId) {
        walletRepo.update(walletId, {
          name: walletName,
          balance: numericBalance,
          color,
          icon,
        });
      } else {
        walletRepo.add(walletName, numericBalance, color, icon);
      }
      reset();
      navigation.goBack();
    }),
    [handleSubmit, isEditMode, walletId, navigation, reset],
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
      title: isEditMode ? t("edit_title") : t("title"),
    });
  }, [navigation, t, isEditMode]);

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
    isEditMode,
    handleSubmitForm,
    handleOnChangeBallance,
  };
};
