import { TextInputProps } from "react-native";
import { FieldValues, Control, Path } from "react-hook-form";

export interface InputProps<T extends FieldValues> extends TextInputProps {
  name: Path<T>;
  placeholder?: string;
  secureTextEntry?: boolean;
  label?: string;
  control: Control<T>;
  type?: 'number' | 'text' | 'money',
  variant?: 'primary' | 'secondary'
}
