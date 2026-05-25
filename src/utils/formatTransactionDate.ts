import i18n from "i18next";
import { CURRENCY } from "../constants/currencey";

export const formatTransactionDate = (date: Date) => {
  const locale = i18n.language as keyof typeof CURRENCY;

  const localTime = CURRENCY[locale].locale

  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Today, ${new Intl.DateTimeFormat(localTime, {
      hour: "numeric",
      minute: "numeric",
    }).format(date)}`;
  }

  if (isYesterday) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date);
};
