import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Label from "./Label";
import IconButton from "./IconButton";

export interface FieldProps {
  label: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  hasChanges?: boolean;
  handleClear?: () => void;
}

export default function Field(props: FieldProps): React.ReactNode {
  return (
    <View style={props.style}>
      <Label
        style={styles.label}
        text={props.label}
        hasChanges={props.hasChanges}
      />
      <View style={styles.inputs}>
        <View style={styles.input}>{props.children}</View>
        {props.handleClear && (
          <IconButton
            style={styles.clear}
            icon="cancel"
            variant="transparent"
            size={36}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  inputs: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
  },
  clear: {
    marginLeft: 5,
    opacity: 0.25,
  },
});
