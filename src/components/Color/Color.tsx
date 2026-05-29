import { TouchableOpacity } from "react-native";
import { THEME } from "../../theme";
import { FieldValues, useController } from "react-hook-form";
import { InputProps } from "./type";
import Flex from "../Flex/Flex";
import { memo } from "react";
import Box from "../Box";

const ColorComponent = <T extends FieldValues>({
  name,
  control,
  values,
}: InputProps<T>) => {
  const { field } = useController<T>({ name, control });

  return (
    <Flex
      direction="row"
      style={{
        flexWrap: "wrap",
      }}
      justify="space-between"
      gap={1}
    >
      {values.map((item) => {
        const active = field.value === item.value;

        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => field.onChange(item.value)}
            style={[
              {
                width: 50,
                height: 50,
                borderRadius: THEME.radius.full,
                borderWidth: active ? 3 : 0,
                borderColor: item.value ?? THEME.colors.bgPrimary,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Box
              height={38}
              width={38}
              radius="full"
              style={{ backgroundColor: item.value ?? THEME.colors.bgPrimary }}
            />
          </TouchableOpacity>
        );
      })}
    </Flex>
  );
};

const Color = memo(ColorComponent) as typeof ColorComponent;

export { Color };
