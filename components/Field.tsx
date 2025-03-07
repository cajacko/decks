import React from "react";
import ThemedText from "./ThemedText";
import { StyleSheet, View, ViewStyle } from "react-native";

export interface FieldProps {
  label: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export default function Field(props: FieldProps): React.ReactNode {
  return (
    <View style={props.style}>
      <ThemedText style={styles.label} type="h4">
        {props.label}
      </ThemedText>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
});
