import { memo } from "react";
import { FlexProps } from "./type";
import { View } from "react-native";

const FlexComponent = ({
  direction = 'row',
  justify,
  align,
  gap,
  children,
  style,
}: FlexProps) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
          gap: gap,
          backgroundColor: 'transparent',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const Flex = memo(FlexComponent);

export default Flex;
