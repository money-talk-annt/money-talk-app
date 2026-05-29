import {
  Controller,
  FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import { InputProps } from "./type";
import Box from "../Box";
import { BlurEvent, TextInput } from "react-native";
import Text from "../Text";
import { memo, useCallback } from "react";
import { THEME } from "../../theme";
import {
  formatCurrency,
  formatCurrencyInput,
} from "../../utils/formatCurrency";

const InputComponent = <T extends FieldValues>({
  name,
  placeholder,
  secureTextEntry,
  label,
  control,
  type = "text",
  onChangeText,
  ...props
}: InputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController<T>({
    name,
    control,
  });

  const { lineHeight, ...typo } = THEME.typography.bodyLg;

  const handleOnChange = useCallback(
    (value: string) => {
      if (type === "number") {
        const num = Number(value);
        if (num) {
          field.onChange(Number(value));
          onChangeText?.(value);
        }
        return;
      }

      if (type === "money") {
        const newValue = formatCurrencyInput(value);
        field.onChange(newValue);
        onChangeText?.(newValue);
        return;
      }

      onChangeText?.(value);

      field.onChange(value);
    },
    [field.onChange, type],
  );

  return (
    <Box>
      {label && (
        <Text
          type="bodyMd"
          color="textSecondary"
          style={{
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        {...field}
        value={field.value?.toString() ?? ""}
        onChangeText={handleOnChange}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={THEME.colors.textPlaceholder}
        style={{
          paddingHorizontal: THEME.spacing.md,
          paddingVertical: THEME.spacing.container,
          backgroundColor: THEME.colors.surfaceLow,
          ...typo,
        }}
        {...props}
      />
      {error && (
        <Text color="error" type="labelSm">
          {error.message}
        </Text>
      )}
    </Box>
  );
};

const Input = memo(InputComponent) as typeof InputComponent;

export { Input };
