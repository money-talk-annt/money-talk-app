import { memo } from "react";
import { PATHNAME } from "../../constants/pathname";
import { useTranslation } from "react-i18next";
import { THEME } from "../../theme";
import Text from "../Text";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Box from "../Box";

const HeaderRightComponent = ({
  pathname,
}: {
  pathname: (typeof PATHNAME)[keyof typeof PATHNAME];
}) => {
  const { t } = useTranslation("common");
  const { push } = useNavigation<AppNavigation>();
  return (
    <Pressable
      onPress={() => {
        push(pathname as any);
      }}
      style={{
        backgroundColor: THEME.colors.transparent,
      }}
    >
      <Box px="md">
        <Text type="bodyMdBold">{t("add")}</Text>
      </Box>
    </Pressable>
  );
};

const HeaderRight = memo(HeaderRightComponent);

export { HeaderRight };
