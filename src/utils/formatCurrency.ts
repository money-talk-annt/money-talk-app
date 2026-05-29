import { StringFormatParams } from "zod/v4/core";
import { CURRENCY } from "../constants/currencey";

const key = "vi";

export const formatCurrency = (value: number | string) => {
  const { locale, currency } = CURRENCY[key];

  const num = Number(value) ?? 0

  return new Intl.NumberFormat(locale, {
    style:"currency",
    currency,
  }).format(num);
};


export const formatCurrencyInput = (value: string) => {
  const cleaned = value.replace(/[^\d,]/g, "");

  const parts = cleaned.split(",");

  const integerPart = parts[0];
  const decimalPart = parts[1];

  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  );

  if (decimalPart !== undefined) {
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
};