import { memo, useLayoutEffect } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Box from "../../components/Box";
import Text from "../../components/Text";
import Flex from "../../components/Flex/Flex";
import Input from "../../components/Input";
import QuickAction from "../../components/QuickAction";

import { useAddWallet } from "./useAddWallet";
import { THEME } from "../../theme";
import { formatCurrency } from "../../utils/formatCurrency";
import Color from "../../components/Color";
import { COLORS } from "../../constants/colors";
import { WALLET_ICONS } from "../../constants/walletIcon";
import Icon from "../../components/Icon";
import { ActivityIndicator, TouchableOpacity } from "react-native";

const AddWallet = memo(() => {
  const {
    t,
    navigation,
    control,
    currency,
    colorIcon,
    isValid,
    isSubmitting,
    ballance,
    walletName,
    handleSubmitForm,
    handleOnChangeBallance
  } = useAddWallet();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("title"),
    });
  }, [navigation, t]);

  return (
    <Box style={{ flex: 1 }} bgColor="background">
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: THEME.spacing.container,
          paddingTop: THEME.spacing.md,
          flexGrow: 1,
        }}
      >
        <Box
          bgColor="primaryContainer"
          shadow="level2"
          p="fab"
          radius="xl"
          mb="fab"
        >
          <Flex justify="space-between">
            <Box>
              <Text type="bodyMd" color="textWhiteGray">
                {t("card.wallet_name_label")}
              </Text>

              <Text type="headlineMd" color="white">
                {walletName || t("card.wallet_name_placeholder")}
              </Text>
            </Box>

            <MaterialCommunityIcons
              name="wallet"
              size={50}
              color={THEME.colors.white}
            />
          </Flex>

          <Text type="bodyMd" color="textWhiteGray">
            {t("card.current_balance")}
          </Text>

          <Box height={4} />

          <Text type="headlineLg" color="white">
            {formatCurrency(ballance || 0)}
          </Text>
        </Box>

        <Flex direction="column" gap={16}>
          <Input
            label={t("form.wallet_name")}
            control={control}
            name="walletName"
            placeholder={t("form.wallet_name_input")}
          />

          <Input
            label={t("form.initial_balance", {
              currency,
            })}
            control={control}
            name="balance"
            type="money"
            keyboardType="decimal-pad"
            placeholder="0"
            onChangeText={handleOnChangeBallance}
          />
        </Flex>

        <Text type="bodyMd" color="textSecondary" style={{ marginBottom: 6 }}>
          {t("form.icon")}
        </Text>

        <Box bgColor="surfaceLow" p="md" radius="lg">
          <Icon
            control={control}
            name="icon"
            size={20}
            values={WALLET_ICONS}
            color={colorIcon}
          />
        </Box>

        <Text type="bodyMd" color="textSecondary" style={{ marginBottom: 6 }}>
          {t("form.theme_color")}
        </Text>
        <Box bgColor="surfaceLow" p="sm" radius="lg">
          <Color control={control} name="color" values={COLORS} />
        </Box>

        <TouchableOpacity
          onPress={handleSubmitForm}
          disabled={!isValid || isSubmitting}
          activeOpacity={0.8}
          style={{
            marginTop: THEME.spacing.lg,
            paddingVertical: THEME.spacing.container,
            borderRadius: THEME.radius.lg,
            alignItems: "center",
            backgroundColor: THEME.colors.primary,
            opacity: !isValid || isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator color={THEME.colors.white} />
          ) : (
            <Text type="bodyMd" color="white">
              {t("actions.save")}
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </Box>
  );
});

export { AddWallet };
