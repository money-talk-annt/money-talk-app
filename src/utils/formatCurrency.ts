import { CURRENCY } from "../constants/currencey";

const key = "vi";

export const formatCurrency = (value: number) => {
  const { locale, currency } = CURRENCY[key];

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};
