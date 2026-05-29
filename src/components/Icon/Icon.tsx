import { memo } from "react";
import { IconName, icons } from "../../assets/icons";
import { IconProps } from "./type";
import { TouchableOpacity } from "react-native";
import { FieldValues, useController } from "react-hook-form";
import Flex from "../Flex/Flex";
import { THEME } from "../../theme";
import Box from "../Box";

const IconComponent = <T extends FieldValues>({
  name,
  size = 20,
  color,
  control,
  values,
}: IconProps<T>) => {
  const { field } = useController<T>({ name, control });

  return (
    <Flex
      style={{
        flexWrap: "wrap",
      }}
      gap={20}
    >
      {values.map((item) => {
        const isActive = item.value === field.value;
        const Component = icons[item.value as IconName];

        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => {
              field.onChange(item.value);
            }}
          >
            <Box
              bgColor={isActive ? "surfaceHigh" : undefined}
              p="sm"
              radius="full"
            >
              <Component
                width={size}
                height={size}
                fill={isActive ? color : undefined}
                stroke={isActive ? color : undefined}
              />
            </Box>
          </TouchableOpacity>
        );
      })}
    </Flex>
  );
};

const Icon = memo(IconComponent) as typeof IconComponent;

export { Icon };
