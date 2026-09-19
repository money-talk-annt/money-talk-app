import { memo } from "react";
import Box from "../../components/Box";
import { Alert, Modal, TouchableOpacity, View } from "react-native";
import { useTransaction } from "./useTransaction";
import { Scroll } from "../../components/ScrollView/ScrollView";
import Tab from "../../components/Tab";
import Text from "../../components/Text";
import Input from "../../components/Input";
import Icon from "../../components/Icon";
import Flex from "../../components/Flex/Flex";
import { Ionicons } from "@expo/vector-icons";
import { formatDateShort } from "../../utils/date";
import { THEME } from "../../theme";
import { PATHNAME } from "../../constants/pathname";
import { withOpacity } from "../../utils/opacity";
import { TransactionBottomSheet } from "./TransactionBottomSheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SPACING } from "../../theme/spacing";
import Button from "../../components/Button";

const TransactionScreen = () => {
  const {
    t,
    type,
    isEditMode,
    wallets,
    tabItems,
    control,
    categories,
    navigation,
    ActiveWallet,
    walletColor,
    isShowWallet,
    currentDate,
    isShowCalander,
    walletAcitve,
    isShowTime,
    isValid,
    handleSelectTime,
    handleChangeType,
    handleOpenCalander,
    handleCloseCalander,
    handleCloseTime,
    handleCloseWallet,
    handleOpenWallet,
    handleSelectWallet,
    handleSelectDate,
    handleSubmitTransaction,
  } = useTransaction();

  if (wallets?.length === 0) {
    Alert.alert(t("announment.title"), t("announment.description"), [
      {
        text: "OK",
        onPress: () =>
          navigation.navigate("Home", {
            screen: PATHNAME.PROFILE,
            params: { screen: PATHNAME.ADDWALLET },
          }),
      },
    ]);
  }

  return (
    <Box flex={1} pt="md" bgColor="background">
      <Scroll
        isScreen
        isKeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: 70,
        }}
      >
        <Tab value={type} onChange={handleChangeType} items={tabItems} />
        <Box height={32} />
        <Text align="center" type="bodyLgBold" color="outline">
          {t("amount")}
        </Text>
        <Box px="40">
          <Input
            control={control}
            name="amount"
            keyboardType="decimal-pad"
            type="money"
            placeholder="0"
            variant="secondary"
          />
        </Box>

        <Box mt="xl" p="container" radius="xl" bgColor="white" shadow="level1">
          <Text type="bodyLgBold" color="outline">
            {t("category")}
          </Text>
          <Box pt="md">
            <Icon
              variant="secondary"
              itemInRow={4}
              gapX={14}
              gapY={24}
              control={control}
              name="category"
              values={categories}
            />
          </Box>
        </Box>

        <Box
          mt="md"
          style={{
            overflow: "hidden",
          }}
        >
          <Flex justify="space-between" gap={16}>
            <TouchableOpacity
              style={{
                flex: 1,
              }}
              onPress={handleOpenCalander}
              activeOpacity={0.5}
            >
              <Box bgColor="white" p="md" radius="md">
                <Flex align="center">
                  <Box p="icon" bgColor="surfaceLow" radius="full">
                    <Ionicons
                      name="calendar-outline"
                      color={THEME.colors.primary}
                      size={20}
                    />
                  </Box>

                  <Box ml="icon">
                    <Text type="labelMd">{t("time")}</Text>

                    <Text type="labelMdBold">
                      {formatDateShort(currentDate)}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
              }}
              activeOpacity={0.8}
              onPress={handleOpenWallet}
            >
              <Box bgColor="white" p="md" radius="md">
                <Flex align="center">
                  <Box
                    p="icon"
                    style={{
                      backgroundColor: withOpacity(0.3, walletColor),
                    }}
                    radius="full"
                  >
                    <ActiveWallet stroke={walletColor} width={20} height={20} />
                  </Box>

                  <Box ml="md">
                    <Text type="labelMd">{t("wallet")}</Text>

                    <Text numberOfLines={1} type="labelMdBold">
                      {walletAcitve?.name}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </TouchableOpacity>

            <TransactionBottomSheet
              t={t}
              isOpen={isShowWallet}
              onClose={handleCloseWallet}
              data={wallets}
              onSelect={(id) => handleSelectWallet(id)}
            />
            {isShowCalander && (
              <DateTimePickerModal
                isVisible={true}
                mode="date"
                date={currentDate}
                onConfirm={handleSelectDate}
                onCancel={handleCloseCalander}
              />
            )}
            {isShowTime && (
              <DateTimePickerModal
                isVisible={true}
                mode="time"
                date={currentDate}
                onConfirm={handleSelectTime}
                onCancel={handleCloseTime}
              />
            )}
          </Flex>

          <Box
            mt="container"
            bgColor="white"
            p="md"
            shadow="level1"
            radius="lg"
            mb="40"
          >
            <Input
              control={control}
              name="note"
              placeholder={t("notePlaceholder")}
              label={t("note")}
            />
          </Box>

          <Button
            title={isEditMode ? t("update") : t("save")}
            disabled={!isValid}
            onPress={handleSubmitTransaction}
          />
        </Box>
      </Scroll>
    </Box>
  );
};

const Transaction = memo(TransactionScreen);

export { Transaction };
