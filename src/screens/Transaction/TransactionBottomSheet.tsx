import { memo, useCallback, useMemo, useState } from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";
import Text from "../../components/Text";
import { THEME } from "../../theme";
import { IconName, icons } from "../../assets/icons";
import { TFunction } from "i18next";
import Flex from "../../components/Flex/Flex";
import { GetWallet } from "../../database/repository/wallet";
import Box from "../../components/Box";
import { withOpacity } from "../../utils/opacity";
import { SPACING } from "../../theme/spacing";
import { Scroll } from "../../components/ScrollView/ScrollView";

export type TransactionBottomSheetProps = {
  data?: GetWallet[];
  onSelect: (id: number) => void;
  t: TFunction<"transaction">;
  onClose?: VoidFunction;
  isOpen?: boolean;
};

const GAP_X = 12;

const itemInRow = 4;

const TransactionBottomSheet = memo(
  ({
    data = [],
    onSelect,
    t,
    onClose,
    isOpen,
  }: TransactionBottomSheetProps) => {
    const [width, setWidth] = useState(0);

    const sizeIcon = useMemo(() => {
      return (width - (itemInRow - 1) * GAP_X) / itemInRow;
    }, [width]);

    const handleSelectWallet = useCallback((id: number) => {
      onSelect(id);
      onClose?.();
    }, []);

    return (
      <Modal visible={isOpen} transparent animationType="slide">
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <Box
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          p="xl"
          bgColor="white"
          shadow="level2"
        >
          <Flex
            style={{
              marginBottom: SPACING.container,
            }}
            justify="space-between"
          >
            <Text type="bodyLgBold">{t("bottomSheet.title")}</Text>

            <TouchableOpacity onPress={onClose}>
              <Text type="bodyMd">{t("bottomSheet.close")}</Text>
            </TouchableOpacity>
          </Flex>

          <Scroll>
            <Flex
              style={{
                flexWrap: "wrap",
                columnGap: GAP_X,
                rowGap: 20,
              }}
              onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
            >
              {data.map((item) => {
                const IconComponent = icons[item.icon as IconName];
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleSelectWallet(item.id)}
                  >
                    <Box width={sizeIcon}>
                      <Box
                        style={{
                          backgroundColor: withOpacity(0.3, item.color),
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        radius="full"
                        height={sizeIcon}
                        width={sizeIcon}
                        mb="sm"
                      >
                        <IconComponent
                          stroke={item.color}
                          width={25}
                          height={25}
                        />
                      </Box>
                      <Text align="center">{item.name}</Text>
                    </Box>
                  </TouchableOpacity>
                );
              })}
            </Flex>
          </Scroll>
        </Box>
      </Modal>
    );
  },
);

export { TransactionBottomSheet };
