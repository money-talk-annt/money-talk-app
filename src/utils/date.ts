import i18n from "../i18n";
import dayjs from "./dayjs";

export const formatDate = (date: Date) => {
  return dayjs(date).locale(i18n.language).format("LL");
};

export const formatDateShort = (date: Date) => {
  return dayjs(date).locale(i18n.language).format("L");
};

export const formatRelativeDate = (date: Date) => {
  return dayjs(date).locale(i18n.language).fromNow();
};
