import viCommon from "./locales/vi/common.json";
import viDashboard from "./locales/vi/dashboard.json";
import viTransaction from "./locales/vi/transaction.json";
import viAnalysis from "./locales/vi/analysis.json";
import viProfile from "./locales/vi/profile.json";

import enCommon from "./locales/en/common.json";
import enDashboard from "./locales/en/dashboard.json";
import enTransaction from "./locales/en/transaction.json";
import enAnalysis from "./locales/en/analysis.json";
import enProfile from "./locales/en/profile.json";

const resources = {
  vi: {
    common: viCommon,
    dashboard: viDashboard,
    transaction: viTransaction,
    analysis: viAnalysis,
    profile: viProfile,
  },
  en: {
    common: enCommon,
    dashboard: enDashboard,
    transaction: enTransaction,
    analysis: enAnalysis,
    profile: enProfile,
  },
}

export default resources;
