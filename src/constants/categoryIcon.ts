import { TFunction } from "i18next";
import { TypeState } from "../screens/Transaction/useTransaction";

export const CATEGORY_ICONS = (
  t: TFunction<"common">,
  type = "expense" as TypeState,
) =>
  type === "expense"
    ? [
        { key: "food", value: "food", label: t("categories.food") },
        { key: "car", value: "car", label: t("categories.transport") },
        { key: "bag", value: "bag", label: t("categories.shopping") },
        { key: "home", value: "home", label: t("categories.home") },
        { key: "health", value: "health", label: t("categories.health") },
        { key: "coffee", value: "coffee", label: t("categories.coffee") },
        { key: "other", value: "other", label: t("categories.other") },
      ]
    : [
        { key: "cash", value: "cash", label: t("categories.salary") },
        { key: "gift", value: "gift", label: t("categories.gift") },
        { key: "bank", value: "bank", label: t("categories.savingsInterest") },
        { key: "sale", value: "sale", label: t("categories.sale") },
        { key: "pc", value: "pc", label: t("categories.freelance") },
        { key: "refund", value: "refund", label: t("categories.refund") },
        { key: "trending", value: "trending", label: t("categories.business") },
        { key: "other", value: "other", label: t("categories.other") },
      ];
