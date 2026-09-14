import { I18N_CATEGORY_KEY } from "../constants/categoryIcon";

export const mapI18n: any = (key: string) => {
    return I18N_CATEGORY_KEY[key as keyof typeof I18N_CATEGORY_KEY];
}