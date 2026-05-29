import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GetWallet, WalletRepository } from "../../database/repository/wallet";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";


export const useWallet = () => {
  const { t } = useTranslation("wallet");
  const [datas, setDatas] = useState<GetWallet[]>();
  const walletRepo = new WalletRepository();
  const navigation = useNavigation<AppNavigation>();


  useEffect(() => {
    navigation.setOptions({
      title: t("title"),
    });
  }, [navigation, t]);

  useFocusEffect(
    useCallback(() => {
      const data = walletRepo.get();
      setDatas(data);
    }, []),
  );

  const totalMoney = useMemo(() => {
    return datas?.reduce((prev, current) => prev + current.balance, 0) ?? 0;
  }, [datas]);

  return { t, totalMoney, datas };
};
