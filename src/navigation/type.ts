import { NavigatorScreenParams } from "@react-navigation/native";

export type ProfileStackParamList = {
  Wallet: undefined;
  AddWallet: { walletId?: number } | undefined;
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
  TransactionRoot: { transactionId?: number } | undefined;
  TransactionDetail: { id: number } | undefined;
  LocketCamera: undefined;
  Wallet: undefined;
  AddWallet: { walletId?: number } | undefined;
};