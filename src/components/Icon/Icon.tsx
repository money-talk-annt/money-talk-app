import { memo, useMemo, useState } from "react";
import { IconName, icons } from "../../assets/icons";
import { IconProps } from "./type";
import { DimensionValue, StyleSheet, TouchableOpacity } from "react-native";
import { FieldValues, useController } from "react-hook-form";
import Flex from "../Flex/Flex";
import { THEME } from "../../theme";
import Box from "../Box";
import Text from "../Text";

const IconComponent = <T extends FieldValues>({
  name,
  size = 20,
  color,
  control,
  values,
  variant = "primary",
  itemInRow = 6,
  gapX = 0,
  gapY = 0,
}: IconProps<T>) => {
  const [width, setWidth] = useState(0);
  const { field } = useController<T>({ name, control });

  const itemWidth = useMemo(() => {
    return (width - gapX * (itemInRow - 1)) / itemInRow;
  }, [itemInRow, width]) as DimensionValue;

  return (
    <Flex
      style={{
        flexWrap: "wrap",
        rowGap: gapY,
        columnGap: gapX,
      }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {values.map((item) => {
        const isActive = item.value === field.value;
        const Component = icons[item.value as IconName];

        return (
          <Box
            key={item.key}
            style={{
              flexDirection: "column",
              alignItems: "center",
              width: itemWidth
            }}
          >
            <TouchableOpacity
              onPress={() => {
                field.onChange(item.value);
              }}
              style={{
                width: itemWidth,
                height: itemWidth,
              }}
            >
              <Box
                bgColor={isActive ? "surfaceHigh" : undefined}
                radius="full"
                style={[
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  },
                  variant === "secondary" && {
                    backgroundColor: isActive
                      ? THEME.colors.primaryContainer
                      : THEME.colors.category,
                  },
                ]}
              >
                <Component
                  width={size}
                  height={size}
                  fill={isActive ? color : undefined}
                  stroke={isActive ? color : undefined}
                />
              </Box>
            </TouchableOpacity>
            {variant === "secondary" && (
              <Text align="center" type="labelSm">
                {item.label}
              </Text>
            )}
          </Box>
        );
      })}
    </Flex>
  );
};

const iconStyles = StyleSheet.create({
  secondary: {
    backgroundColor: THEME.colors.category,
  },
});

const Icon = memo(IconComponent) as typeof IconComponent;

export { Icon };
