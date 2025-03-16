import React from "react";
import Field, { FieldProps } from "./Field";
import Switch, { SwitchProps } from "./Switch";

export interface SwitchFieldProps
  extends SwitchProps,
    Pick<FieldProps, "label"> {
  FieldProps?: Partial<FieldProps>;
}

export default function SwitchField({
  label,
  FieldProps,
  ...switchProps
}: SwitchFieldProps): React.ReactNode {
  return (
    <Field label={label} inline {...FieldProps}>
      <Switch {...switchProps} />
    </Field>
  );
}
