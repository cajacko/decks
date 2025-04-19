import ThemedText, { ThemedTextProps } from "@/components/ui/ThemedText";
import React from "react";

export interface NumberProps extends Pick<ThemedTextProps, "style"> {
  number: number;
}

export default function Number({
  number,
  style,
}: NumberProps): React.ReactNode {
  return (
    <ThemedText type="h2" style={style}>
      {number}
    </ThemedText>
  );
}
