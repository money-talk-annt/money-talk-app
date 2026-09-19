import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GetWallet, walletRepo } from "../../database/repository/wallet";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { formatCurrency } from "../../utils/formatCurrency";
import { PATHNAME } from "../../constants/pathname";

export const useWallet = () => {
  const { t } = useTranslation("wallet");
  const [datas, setDatas] = useState<GetWallet[]>();
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const navigation = useNavigation<AppNavigation>();

  const toggleBalanceVisibility = useCallback(() => {
    setIsBalanceVisible((prev) => !prev);
  }, []);

  const refreshWallets = useCallback(() => {
    const data = walletRepo.gets();
    setDatas(data);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: t("title"),
    });
  }, [navigation, t]);

  useFocusEffect(
    useCallback(() => {
      setIsBalanceVisible(false);
      refreshWallets();
    }, [refreshWallets]),
  );

  const totalMoney = useMemo(() => {
    return datas?.reduce((prev, current) => prev + current.balance, 0) ?? 0;
  }, [datas]);

  const handleEditWallet = useCallback(
    (wallet: GetWallet) => {
      navigation.navigate(PATHNAME.ADDWALLET, { walletId: wallet.id });
    },
    [navigation],
  );

  const handleDeleteWallet = useCallback(
    (wallet: GetWallet) => {
      if (!datas || datas.length <= 1) {
        Alert.alert(t("cannot_delete_last_title"), t("cannot_delete_last_desc"));
        return;
      }

      const targetWallet = datas.find((w) => w.id !== wallet.id);
      if (!targetWallet) return;

      Alert.alert(
        t("delete_confirm_title"),
        t("delete_confirm_desc", {
          amount: formatCurrency(wallet.balance),
          targetWallet: targetWallet.name,
          walletName: wallet.name,
        }),
        [
          { text: t("cancel"), style: "cancel" },
          {
            text: t("delete"),
            style: "destructive",
            onPress: () => {
              try {
                walletRepo.deleteWithTransfer(wallet.id);
                refreshWallets();
              } catch (error) {
                console.error("Failed to delete wallet:", error);
              }
            },
          },
        ],
      );
    },
    [datas, t, refreshWallets],
  );

  return {
    t,
    totalMoney,
    datas,
    isBalanceVisible,
    toggleBalanceVisibility,
    handleEditWallet,
    handleDeleteWallet,
  };
};
