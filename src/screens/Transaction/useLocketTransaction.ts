import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as FileSystem from "expo-file-system/legacy";
import { MONEY } from "../../constants/pattern";
import { GetWallet, walletRepo } from "../../database/repository/wallet";
import { transactionRepo } from "../../database/repository/transaction";
import {
  formatCurrencyInput,
  getCurrencySymbol,
} from "../../utils/formatCurrency";

export type LocketStep = "camera" | "review";

const locketSchema = (t: any) =>
  z.object({
    type: z.enum(["expense", "income"]),
    amount: z
      .string({ error: t("errors.required") })
      .min(1, t("errors.required"))
      .regex(MONEY, t("errors.number")),
    walletId: z.number(),
    date: z.date(),
    note: z.string().max(255, t("errors.maxLength")).optional(),
  });

export type LocketFormType = z.infer<ReturnType<typeof locketSchema>>;

export const QUICK_TAGS = [
  {
    id: "food",
    labelKey: "locket.tags.food",
    fallbackLabel: "Ăn uống",
    emoji: "🍔",
    icon: "restaurant",
  },
  {
    id: "coffee",
    labelKey: "locket.tags.coffee",
    fallbackLabel: "Cà phê",
    emoji: "☕",
    icon: "cafe",
  },
  {
    id: "transport",
    labelKey: "locket.tags.transport",
    fallbackLabel: "Di chuyển",
    emoji: "🛵",
    icon: "bicycle",
  },
  {
    id: "shopping",
    labelKey: "locket.tags.shopping",
    fallbackLabel: "Mua sắm",
    emoji: "🛒",
    icon: "cart",
  },
  {
    id: "entertainment",
    labelKey: "locket.tags.entertainment",
    fallbackLabel: "Giải trí",
    emoji: "🎮",
    icon: "game-controller",
  },
  {
    id: "bill",
    labelKey: "locket.tags.bill",
    fallbackLabel: "Hóa đơn",
    emoji: "🧾",
    icon: "receipt",
  },
];

export const useLocketTransaction = () => {
  const navigation = useNavigation<AppNavigation>();
  const { t, i18n } = useTranslation("transaction");
  const { t: tCommon } = useTranslation("common");

  const currencySymbol = useMemo(
    () => getCurrencySymbol(i18n.language),
    [i18n.language],
  );

  const [step, setStep] = useState<LocketStep>("camera");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [wallets, setWallets] = useState<GetWallet[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowWallet, setIsShowWallet] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<LocketFormType>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(locketSchema(t)),
    defaultValues: {
      type: "expense",
      amount: undefined,
      walletId: undefined,
      date: new Date(),
      note: "",
    },
  });

  const type = watch("type");
  const walletId = watch("walletId");
  const amount = watch("amount");
  const note = watch("note");

  // Load wallets
  useEffect(() => {
    const data = walletRepo.gets();
    setWallets(data);
    if (data.length > 0 && !walletId) {
      setValue("walletId", data[0].id);
    }
  }, []);

  const walletActive = useMemo(() => {
    return wallets.find((w) => w.id === walletId);
  }, [wallets, walletId]);

  // Handle photo captured
  const handlePhotoCaptured = useCallback(
    async (tempUri: string) => {
      try {
        // Save photo to document directory for persistence
        const fileName = `locket_${Date.now()}.jpg`;
        const destUri = `${FileSystem.documentDirectory}locket_photos/${fileName}`;

        // Ensure directory exists
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}locket_photos/`,
          { intermediates: true },
        );

        await FileSystem.copyAsync({
          from: tempUri,
          to: destUri,
        });

        setPhotoUri(destUri);
        setStep("review");
      } catch (error) {
        console.error("Failed to save photo:", error);
        Alert.alert(t("announment.title"), t("locket.photoSaveFailed"));
      }
    },
    [t],
  );

  const handleRetake = useCallback(() => {
    setPhotoUri(null);
    setStep("camera");
  }, []);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleChangeType = useCallback(
    (value: "income" | "expense") => {
      setValue("type", value);
    },
    [setValue],
  );

  const handleOpenWallet = useCallback(() => {
    setIsShowWallet(true);
  }, []);

  const handleCloseWallet = useCallback(() => {
    setIsShowWallet(false);
  }, []);

  const handleSelectWallet = useCallback(
    (id: number) => {
      setValue("walletId", id);
    },
    [setValue],
  );

  const handleSubmitTransaction = useCallback(
    handleSubmit(async ({ amount, type, walletId, date, note }) => {
      if (!photoUri || isSubmitting) return;
      setIsSubmitting(true);

      try {
        const numAmount = parseFloat(
          typeof amount === "string"
            ? amount.replaceAll(".", "").replace(",", ".")
            : String(amount),
        );

        transactionRepo.createWithWalletUpdate({
          wallet_id: walletId,
          type,
          amount: numAmount,
          category: "locket",
          note: note || undefined,
          transaction_date: date ? date.toISOString() : undefined,
          image_uri: photoUri,
        });

        reset();
        Alert.alert(t("announment.title"), t("success"), [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } catch (error) {
        console.error(error);
        Alert.alert(t("announment.title"), t("failure"));
      } finally {
        setIsSubmitting(false);
      }
    }),
    [handleSubmit, photoUri, isSubmitting, reset, t, navigation],
  );

  return {
    t,
    tCommon,
    step,
    photoUri,
    type,
    amount,
    note,
    wallets,
    walletActive,
    walletId,
    control,
    setValue,
    isValid,
    isSubmitting,
    isShowWallet,
    handlePhotoCaptured,
    handleRetake,
    handleClose,
    handleChangeType,
    handleOpenWallet,
    handleCloseWallet,
    handleSelectWallet,
    handleSubmitTransaction,
    currencySymbol,
  };
};
