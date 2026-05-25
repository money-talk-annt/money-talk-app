import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "../hooks/useTranslation";

const LanguageSwitcher = () => {
  const { t, switchLanguage, currentLanguage } = useTranslation("common");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("language")}</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.button,
            currentLanguage === "vi" && styles.activeButton,
          ]}
          onPress={() => switchLanguage("vi")}
        >
          <Text
            style={[
              styles.buttonText,
              currentLanguage === "vi" && styles.activeButtonText,
            ]}
          >
            {t("vietnamese")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            currentLanguage === "en" && styles.activeButton,
          ]}
          onPress={() => switchLanguage("en")}
        >
          <Text
            style={[
              styles.buttonText,
              currentLanguage === "en" && styles.activeButtonText,
            ]}
          >
            {t("english")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  activeButtonText: {
    color: "#fff",
  },
});

export default LanguageSwitcher;
