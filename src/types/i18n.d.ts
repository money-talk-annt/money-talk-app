import "i18next";
import commonVi from "../i18n/locales/vi/common.json";
import dashboardVi from "../i18n/locales/vi/dashboard.json";
import transactionVi from "../i18n/locales/vi/transaction.json";
import analysisVi from "../i18n/locales/vi/analysis.json";
import profileVi from "../i18n/locales/vi/profile.json";
import resources from "../i18n/resources";

const resourceVi = resources.vi;

type ResourceKey = typeof resourceVi;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: ResourceKey;
  }
}
