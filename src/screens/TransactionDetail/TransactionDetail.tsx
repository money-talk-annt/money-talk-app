import { memo, useLayoutEffect } from "react";
import { Scroll } from "../../components/ScrollView/ScrollView";
import Box from "../../components/Box";
import Text from "../../components/Text";
import { useTransactionDetail } from "./useTransactionDetail";
import { THEME } from "../../theme";

const TransactionDetail = memo(() => {
  const { t, tCommon, data, Icon } = useTransactionDetail();

  return (
    <Box bgColor="background" style={{ flex: 1 }}>
      <Scroll
        isScreen
        contentContainerStyle={{
          paddingTop: 32,
        }}
      >
        <Icon
          height={40}
          width={40}
          fill={THEME.colors.secondary}
        />
      </Scroll>
    </Box>
  );
});

export { TransactionDetail };
