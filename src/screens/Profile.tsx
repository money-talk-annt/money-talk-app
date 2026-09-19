import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useTranslation } from "../hooks/useTranslation";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { PATHNAME } from "../constants/pathname";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../theme";
import { withOpacity } from "../utils/opacity";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Scroll } from "../components/ScrollView/ScrollView";

export default function Profile() {
  const { t } = useTranslation("profile");
  const navigation = useNavigation<AppNavigation>();
  const insets = useSafeAreaInsets();

  return (
    <Scroll
      isScreen
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom + 24, 40),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>{t("title")}</Text>
      </View>

      {/* User Hero Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color={THEME.colors.white} />
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>Money Talk</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{t("standard_user")}</Text>
          </View>
        </View>

        <View style={styles.contactDivider} />

        <View style={styles.contactDetails}>
          <View style={styles.contactItem}>
            <Ionicons
              name="mail-outline"
              size={15}
              color={THEME.colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.contactText}>user@example.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons
              name="call-outline"
              size={15}
              color={THEME.colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.contactText}>+84 987 654 321</Text>
          </View>
        </View>
      </View>

      {/* Wallet Management Button (Prominent Action Card) */}
      <TouchableOpacity
        style={styles.manageWalletCard}
        activeOpacity={0.7}
        onPress={() => (navigation as any).navigate(PATHNAME.WALLET)}
      >
        <View style={styles.walletIconContainer}>
          <Ionicons name="wallet" size={24} color={THEME.colors.white} />
        </View>

        <View style={styles.walletCardContent}>
          <Text style={styles.walletCardTitle}>{t("manage_wallet")}</Text>
          <Text style={styles.walletCardSubtitle}>
            {t("manage_wallet_desc")}
          </Text>
        </View>

        <View style={styles.walletChevron}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={THEME.colors.primary}
          />
        </View>
      </TouchableOpacity>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeaderTitle}>{t("preferences")}</Text>

        <View style={styles.settingsGroup}>
          <LanguageSwitcher />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrap,
                  { backgroundColor: withOpacity(0.1, THEME.colors.primary) },
                ]}
              >
                <Ionicons
                  name="cash-outline"
                  size={18}
                  color={THEME.colors.primary}
                />
              </View>
              <Text style={styles.settingLabel}>{t("currency")}</Text>
            </View>
            <Text style={styles.settingValue}>VND (₫)</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrap,
                  { backgroundColor: withOpacity(0.1, "#F59E0B") },
                ]}
              >
                <Ionicons
                  name="color-palette-outline"
                  size={18}
                  color="#F59E0B"
                />
              </View>
              <Text style={styles.settingLabel}>{t("theme")}</Text>
            </View>
            <Text style={styles.settingValue}>Light</Text>
          </View>

          <View style={[styles.settingRow, styles.lastSettingRow]}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrap,
                  { backgroundColor: withOpacity(0.1, "#10B981") },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color="#10B981"
                />
              </View>
              <Text style={styles.settingLabel}>{t("notifications")}</Text>
            </View>
            <Text style={styles.settingValue}>On</Text>
          </View>
        </View>
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeaderTitle}>{t("app_info")}</Text>

        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrap,
                  {
                    backgroundColor: withOpacity(
                      0.1,
                      THEME.colors.textSecondary,
                    ),
                  },
                ]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={THEME.colors.textSecondary}
                />
              </View>
              <Text style={styles.settingLabel}>{t("version")}</Text>
            </View>
            <Text style={styles.settingValue}>v1.0.0</Text>
          </View>

          <TouchableOpacity
            style={[styles.settingRow, styles.lastSettingRow]}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrap,
                  { backgroundColor: withOpacity(0.1, THEME.colors.primary) },
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={THEME.colors.primary}
                />
              </View>
              <Text style={styles.settingLabel}>{t("privacy")}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={THEME.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      {/* <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={THEME.colors.expense}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutText}>{t("logout")}</Text>
        </TouchableOpacity>
      </View> */}
    </Scroll>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  contentContainer: {
    paddingHorizontal: THEME.spacing.container,
  },
  header: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: THEME.colors.text,
  },
  userCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.xl,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: withOpacity(0.1, THEME.colors.primary),
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.primary,
  },
  contactDivider: {
    width: "100%",
    height: 1,
    backgroundColor: withOpacity(0.08, THEME.colors.text),
    marginVertical: 12,
  },
  contactDetails: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
  manageWalletCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: withOpacity(0.15, THEME.colors.primary),
    ...Platform.select({
      ios: {
        shadowColor: THEME.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  walletCardContent: {
    flex: 1,
  },
  walletCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: 2,
  },
  walletCardSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  walletChevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: withOpacity(0.08, THEME.colors.primary),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingsGroup: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: withOpacity(0.06, THEME.colors.text),
  },
  lastSettingRow: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: THEME.colors.text,
  },
  settingValue: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
  },
  logoutContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: withOpacity(0.08, THEME.colors.expense),
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: withOpacity(0.2, THEME.colors.expense),
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: THEME.colors.expense,
  },
});
