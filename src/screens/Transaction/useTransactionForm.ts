import { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MONEY } from "../../constants/pattern";
import { CATEGORY_ICONS } from "../../constants/categoryIcon";
import { icons } from "../../assets/icons";

export const transactionSchema = (
  t: TFunction<"transaction">
) =>
  z.object({
    type: z.enum(["expense", "income"]),

    amount: z
      .string()
      .min(1, t("errors.required"))
      .regex(MONEY, t("errors.number")),

    category: z.string().min(1, t("errors.required")),

    walletId: z.number(),

    date: z.date(),

    note: z
      .string()
      .max(255, t("errors.maxLength"))
      .optional(),
  });

export type TransactionType = z.infer<
  ReturnType<typeof transactionSchema>
>;

export const useTransactionForm = (
  t: TFunction<"transaction">
) => {
  return useForm<TransactionType>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(transactionSchema(t)),
    defaultValues: {
      type: "expense",
      amount: undefined,
      category: "food" as keyof typeof icons,
      walletId: undefined,
      date: new Date(),
      note: "",
    },
  });
};