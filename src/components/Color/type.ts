import { TouchableOpacityProps } from "react-native";
import { FieldValues, Control, Path } from "react-hook-form";

type Values = {
  key: string;
  value: string;
};

export interface InputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  values: Values[];
}
