import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { TabItem } from "../../components/Tab";
import { useTransactionForm } from "./useTransactionForm";
import { CATEGORY_ICONS } from "../../constants/categoryIcon";
import { IconName, icons } from "../../assets/icons";
import { GetWallet, WalletRepository } from "../../database/repository/wallet";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../theme";
import BottomSheet from "@gorhom/bottom-sheet";

export type TypeState = "income" | "expense";

export const useTransaction = () => {
  const navigation = useNavigation<AppNavigation>();
  const { t } = useTranslation("transaction");
  const { t: tCommon } = useTranslation("common");
  const { control, handleSubmit, setValue, watch, getValues } =
    useTransactionForm(t);
  const [isShowCalander, setIsShowCalander] = useState(false);
  const [isShowWallet, setIsShowWallet] = useState(false);
  const [wallets, setWallets] = useState<GetWallet[]>();

  const walletRepo = new WalletRepository();

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
      title: t("title"),
    });
  }, [navigation, t]);

  useFocusEffect(
    useCallback(() => {
      const data = walletRepo.get();
      setWallets(data);
    }, []),
  );

  const handleOpenCalander = useCallback(() => {
    setIsShowCalander(true);
  }, []);

  const handleCloseCalander = useCallback(() => {
    setIsShowCalander(false);
  }, []);

  const handleOpenWallet = useCallback(() => {
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
  }, [walletId]);

  useLayoutEffect(() => {
    const walletId = getValues("walletId");
    if (!walletId && wallets) {
      setValue("walletId", wallets?.[0].id);
    }
  }, [wallets]);

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
      handleCloseCalander();
    },
    [setValue],
  );

  const handleSubmitTransaction = useCallback(
    handleSubmit(({ amount, category, date, type, walletId, note }) => {}),
    [],
  );

  return {
    t,
    type,
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
    handleSelectWallet,
    handleOpenWallet,
    handleCloseWallet,
    handleChangeType,
    handleOpenCalander,
    handleCloseCalander,
    handleSelectDate,
  };
};
