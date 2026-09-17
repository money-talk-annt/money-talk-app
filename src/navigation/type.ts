import { NavigatorScreenParams } from "@react-navigation/native";

export type ProfileStackParamList = {
  Wallet: undefined;
  AddWallet: undefined;
  ProfileStack: undefined;
};

export type DashboardStackParamList = {
    DashboardStack: undefined
}

export type RootTabParamList = {
  Dashboards: NavigatorScreenParams<DashboardStackParamList>;
  History: undefined;
  Transaction: undefined;
  Analytics: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Home: NavigatorScreenParams<RootTabParamList>;
  TransactionRoot: undefined;
  TransactionDetail: undefined;
  Wallet: undefined;
  AddWallet: undefined;
};