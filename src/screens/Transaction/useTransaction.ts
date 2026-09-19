import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { TabItem } from "../../components/Tab";
import { useTransactionForm } from "./useTransactionForm";
import { CATEGORY_ICONS } from "../../constants/categoryIcon";
import { IconName, icons } from "../../assets/icons";
import { GetWallet, walletRepo } from "../../database/repository/wallet";
import { THEME } from "../../theme";
import { Alert } from "react-native";
import { transactionRepo } from "../../database/repository/transaction";
import { formatCurrencyInput } from "../../utils/formatCurrency";

export type TypeState = "income" | "expense";

export const useTransaction = () => {
  const navigation = useNavigation<AppNavigation>();
  const route = useRoute<RouteProp<RootStackParamList, "TransactionRoot">>();
  const transactionId = route.params?.transactionId;
  const isEditMode = Boolean(transactionId);

  const { t } = useTranslation("transaction");
  const { t: tCommon } = useTranslation("common");
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { isValid },
  } = useTransactionForm(t);
  const [isShowCalander, setIsShowCalander] = useState(false);
  const [isShowWallet, setIsShowWallet] = useState(false);
  const [isShowTime, setIsShowTime] = useState(false);
  const [wallets, setWallets] = useState<GetWallet[]>();

  const type = watch("type");

  const walletId = watch("walletId");

  const categories = useMemo(() => {
    return CATEGORY_ICONS(tCommon, type);
  }, [CATEGORY_ICONS, tCommon, type]);

  const tabItems = useMemo(() => {
    return [
      {
        value: "expense",
        label: t("expense"),
      },
      {
        value: "income",
        label: t("income"),
      },
    ];
  }, []) as TabItem<TypeState>[];

  const handleChangeType = useCallback(
    (value: typeof type) => {
      setValue("type", value);

      if (value === "expense") {
        setValue("category", "food" as IconName);
      } else {
        setValue("category", "cash" as IconName);
      }
    },
    [setValue],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditMode ? t("editTitle") : t("title"),
    });
  }, [navigation, t, isEditMode]);

  // If in edit mode, prefill form with existing transaction data
  useEffect(() => {
    if (transactionId) {
      const tx = transactionRepo.getById(transactionId);
      if (tx) {
        setValue("type", tx.type);
        setValue("amount", formatCurrencyInput(String(tx.amount)));
        setValue("category", tx.category as IconName);
        if (tx.wallet_id) {
          setValue("walletId", tx.wallet_id);
        }
        if (tx.transactionDate) {
          setValue("date", new Date(tx.transactionDate));
        }
        setValue("note", tx.note || "");
      }
    }
  }, [transactionId, setValue]);

  useFocusEffect(
    useCallback(() => {
      const data = walletRepo.gets();
      setWallets(data);
    }, []),
  );

  const handleOpenCalander = useCallback(() => {
    setIsShowCalander(true);
  }, []);

  const handleCloseCalander = useCallback(() => {
    setIsShowCalander(false);
  }, []);

  const handleCloseTime = useCallback(() => {
    setIsShowTime(false);
  }, []);

  const handleOpenWallet: VoidFunction = useCallback(() => {
    setIsShowWallet(true);
  }, []);

  const handleCloseWallet = useCallback(() => {
    setIsShowWallet(false);
  }, []);

  const [ActiveWallet, walletColor] = useMemo(() => {
    if (walletId) {
      const walletIcon = wallets?.find((item) => item.id === walletId);
      return [icons[walletIcon?.icon as IconName], walletIcon?.color];
    }
    return [icons.wallet, THEME.colors.secondary];
  }, [walletId, wallets]);

  useLayoutEffect(() => {
    if (!walletId && wallets && !isEditMode) {
      setValue("walletId", wallets?.[0]?.id);
    }
  }, [wallets, walletId, isEditMode, setValue]);

  const handleSelectWallet = useCallback(
    (id: number) => {
      setValue("walletId", id);
    },
    [setValue],
  );

  const walletAcitve = useMemo(() => {
    return wallets?.find((item) => item.id === walletId);
  }, [wallets, walletId]);

  const currentDate = watch("date");

  const handleSelectDate = useCallback(
    (value: Date) => {
      setValue("date", value);
      setIsShowTime(true);
      setIsShowCalander(false);
    },
    [setValue],
  );

  const handleSelectTime = useCallback(
    (value: Date) => {
      const current = getValues("date");
      const mergedDate = new Date(current);
      mergedDate.setHours(value.getHours());
      mergedDate.setMinutes(value.getMinutes());
      mergedDate.setSeconds(value.getSeconds());
      mergedDate.setMilliseconds(value.getMilliseconds());

      setValue("date", mergedDate);
      setIsShowTime(false);
    },
    [getValues, setValue],
  );

  const handleSubmitTransaction = useCallback(
    handleSubmit(async ({ amount, category, date, type, walletId, note }) => {
      try {
        const numAmount = parseFloat(
          typeof amount === "string"
            ? amount.replaceAll(".", "").replace(",", ".")
            : String(amount),
        );

        if (isEditMode && transactionId) {
          transactionRepo.updateWithWalletUpdate(transactionId, {
            wallet_id: walletId,
            type,
            amount: numAmount,
            category,
            note: note || undefined,
            transaction_date: date ? date.toISOString() : undefined,
          });
          Alert.alert(t("announment.title"), t("updateSuccess"), [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        } else {
          transactionRepo.createWithWalletUpdate({
            wallet_id: walletId,
            type,
            amount: numAmount,
            category,
            note: note || undefined,
            transaction_date: date ? date.toISOString() : undefined,
          });

          reset();
          Alert.alert(t("announment.title"), t("success"), [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        }
      } catch (error) {
        console.error(error);
        Alert.alert(
          t("announment.title"),
          isEditMode ? t("updateFailure") : t("failure"),
        );
      }
    }),
    [
      handleSubmit,
      transactionRepo,
      reset,
      t,
      isEditMode,
      transactionId,
      navigation,
    ],
  );

  return {
    t,
    type,
    isEditMode,
    wallets,
    navigation,
    tabItems,
    control,
    ActiveWallet,
    walletColor,
    categories,
    isShowCalander,
    isShowWallet,
    walletAcitve,
    currentDate,
    isValid,
    isShowTime,
    handleSelectWallet,
    handleSelectTime,
    handleOpenWallet,
    handleCloseWallet,
    handleChangeType,
    handleOpenCalander,
    handleCloseCalander,
    handleCloseTime,
    handleSelectDate,
    handleSubmitTransaction,
  };
};
