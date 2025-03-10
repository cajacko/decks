import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Label from "./Label";

export interface FieldProps {
  label: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  hasChanges?: boolean;
}

export default function Field(props: FieldProps): React.ReactNode {
  return (
    <View style={props.style}>
      <Label
        style={styles.label}
        text={props.label}
        hasChanges={props.hasChanges}
      />
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
});
