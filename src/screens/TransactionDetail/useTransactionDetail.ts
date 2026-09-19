import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import {
  GetTransaction,
  transactionRepo,
} from "../../database/repository/transaction";
import { PATHNAME } from "../../constants/pathname";
import { setSkipScrollToTop } from "../../utils/navigationScrollHelper";

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
  }, [navigation, t]);

  useFocusEffect(
    useCallback(() => {
      // Mark flag so returning to previous screen (Dashboard or History) will NOT scroll to top
      setSkipScrollToTop(true);

      if (!params?.id) return;
      const res = transactionRepo.getById(params.id);
      if (res) {
        setData(res);
      }
    }, [params?.id]),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      setSkipScrollToTop(true);
    });
    return () => {
      setSkipScrollToTop(true);
      unsubscribe();
    };
  }, [navigation]);

  const handleEdit = useCallback(() => {
    if (!data?.id) return;
    navigation.navigate(PATHNAME.TRANSACTION_ROOT, { transactionId: data.id });
  }, [data?.id, navigation]);

  const handleDelete = useCallback(() => {
    if (!data?.id) return;

    Alert.alert(
      t("detail.deleteConfirmTitle"),
      t("detail.deleteConfirmMessage"),
      [
        {
          text: tCommon("cancel", "Hủy"),
          style: "cancel",
        },
        {
          text: t("detail.delete"),
          style: "destructive",
          onPress: () => {
            try {
              setSkipScrollToTop(true);
              transactionRepo.deleteWithWalletUpdate(data.id);
              navigation.goBack();
            } catch (error) {
              console.error("Failed to delete transaction:", error);
            }
          },
        },
      ],
    );
  }, [data?.id, t, tCommon, navigation]);

  const isIncome = data?.type === "income";

  return {
    t,
    tCommon,
    data,
    isIncome,
    handleEdit,
    handleDelete,
    navigation,
  };
};
