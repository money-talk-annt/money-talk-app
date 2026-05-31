import { Control, FieldValues, Path } from "react-hook-form";
import { IconName } from "../../assets/icons";

export type Icon = {
  key: string;
  value: string;
  label?:string;
};

export interface IconProps<T extends FieldValues> {
  size?: number;
  color?: string;
  control: Control<T>;
  name: Path<T>;
  values: Icon[];
  variant?: "primary" | "secondary";
  itemInRow?: number;
  gapX?: number;
  gapY?: number;
}
