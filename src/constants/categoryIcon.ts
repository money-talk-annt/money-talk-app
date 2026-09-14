import { TFunction } from "i18next";
import { TypeState } from "../screens/Transaction/useTransaction";

export const CATEGORY_ICONS = (
  t: TFunction<"common">,
  type = "expense" as TypeState,
) =>
  type === "expense"
    ? [
        { key: "food", value: "food", label: t("categories.food") },
        { key: "car", value: "car", label: t("categories.car") },
        { key: "bag", value: "bag", label: t("categories.bag") },
        { key: "home", value: "home", label: t("categories.home") },
        { key: "health", value: "health", label: t("categories.health") },
        { key: "coffee", value: "coffee", label: t("categories.coffee") },
        { key: "other", value: "other", label: t("categories.other") },
      ]
    : [
        { key: "cash", value: "cash", label: t("categories.cash") },
        { key: "gift", value: "gift", label: t("categories.gift") },
        { key: "bank", value: "bank", label: t("categories.bank") },
        { key: "sale", value: "sale", label: t("categories.sale") },
        { key: "pc", value: "pc", label: t("categories.pc") },
        { key: "refund", value: "refund", label: t("categories.refund") },
        { key: "trending", value: "trending", label: t("categories.trending") },
        { key: "other", value: "other", label: t("categories.other") },
      ];

export const I18N_CATEGORY_KEY = {
  food: "categories.food",
  car: "categories.car",
  bag: "categories.bag",
  home: "categories.home",
  health: "categories.health",
  coffee: "categories.coffee",
  other: "categories.other",
  cash: "categories.cash",
  gift: "categories.gift",
  refund: "categories.refund",
  trending: "categories.trending",
  pc: "categories.pc",
  bank: "categories.bank",
  sale: "categories.sale",
};
