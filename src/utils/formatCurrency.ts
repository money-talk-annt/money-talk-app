import { CURRENCY } from "../constants/currencey";
import i18n from "../i18n";

export const getCurrencyConfig = (lang?: string) => {
  const currentLang = (lang || i18n.language || "vi").toLowerCase();
  if (currentLang.startsWith("en")) {
    return CURRENCY.en;
  }
  return CURRENCY.vi;
};

export const getCurrencySymbol = (lang?: string) => {
  return getCurrencyConfig(lang).symbol;
};

export const formatCurrency = (value: number | string, lang?: string) => {
  const { locale, currency } = getCurrencyConfig(lang);

  const num = Number(value) ?? 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(num);
};

export const formatCurrencyInput = (value: string) => {
  const cleaned = value.replace(/[^\d,]/g, "");

  const parts = cleaned.split(",");

  const integerPart = parts[0];
  const decimalPart = parts[1];

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  if (decimalPart !== undefined) {
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
};

export const formatCompactAmount = (amount: number): string => {
  if (!amount || amount === 0) return "0";

  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1).replace(".0", "")}B`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(".0", "")}M`;
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}k`;
  }
  return `${amount}`;
};
