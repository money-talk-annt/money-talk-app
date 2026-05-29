import { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const addWalletSchema = (t: TFunction<"addWallet">) =>
  z.object({
    walletName: z
      .string()
      .min(1, t("errors.required"))
      .max(20, t("errors.maxLength")),

    balance: z
      .string()
      .regex(/^\d{1,3}(\.\d{3})*(,\d+)?$/, t("errors.number"))
      .optional(),
    color: z.string(),
    icon: z.string(),
  });

export type AddWalletType = z.infer<ReturnType<typeof addWalletSchema>>;

export const useAddWalletForm = (t: TFunction<"addWallet">) => {
  return useForm<AddWalletType>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(addWalletSchema(t)),
    defaultValues: {
      walletName: "",
      balance: undefined,
      icon: "bag",
      color: "#4343d5",
    },
  });
};
