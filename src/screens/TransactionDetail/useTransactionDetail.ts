import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  GetTransaction,
  transactionRepo,
} from "../../database/repository/transaction";
import { IconName, icons } from "../../assets/icons";

export const useTransactionDetail = () => {
  const { params } =
    useRoute<RouteProp<RootStackParamList, "TransactionDetail">>();
  const { t } = useTranslation("transaction");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation<AppNavigation>();

  const [data, setData] = useState<GetTransaction | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("detail.title"),
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const res = transactionRepo.getById(params?.id);

      setData(res);
    }, []),
  );

  const Icon = useMemo(() => {
    if (!data) return icons["cash"];

    const IconComponent = icons[data.category as IconName];

    return IconComponent || icons["cash"];
  }, [data]);

  return { t, tCommon, data, Icon };
};
