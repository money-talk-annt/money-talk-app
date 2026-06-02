import i18n from "i18next";
import { CURRENCY } from "../constants/currencey";

export const formatTransactionDate = (date: Date | string) => {
  const locale = i18n.language as keyof typeof CURRENCY;

  const localTime = CURRENCY[locale].locale;

  const newDate = typeof date === "string" ? new Date(date) : date;

  const now = new Date();

  const isToday = newDate.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = newDate.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Today, ${new Intl.DateTimeFormat(localTime, {
      hour: "numeric",
      minute: "numeric",
    }).format(newDate)}`;
  }

  if (isYesterday) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(newDate);
};
