import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Label from "./Label";
import IconButton from "./IconButton";
import Checkbox from "expo-checkbox";
import ThemedText from "./ThemedText";

export interface FieldProps {
  label?: string;
  subLabel?: string | null;
  children?: React.ReactNode;
  style?: ViewStyle;
  hasChanges?: boolean;
  handleClear?: () => void;
  handleChangeEnable?: (enabled: boolean) => void;
  enabled?: boolean;
  showEnabled?: boolean;
  faded?: boolean;
  inline?: boolean;
}

export default function Field(props: FieldProps): React.ReactNode {
  const containerStyle = React.useMemo(() => {
    let faded: boolean;

    if (props.faded === undefined) {
      faded = props.enabled === false;
    } else {
      faded = props.faded;
    }

    return StyleSheet.flatten([{ opacity: faded ? 0.5 : 1 }, props.style]);
  }, [props.style, props.enabled, props.faded]);

  return (
    <View style={containerStyle}>
      <View style={styles.labelContainer}>
        <View style={styles.mainLabels}>
          {props.showEnabled && (
            <Checkbox
              style={styles.checkbox}
              value={props.enabled}
              onValueChange={props.handleChangeEnable}
            />
          )}
          {props.label && (
            <Label
              style={styles.label}
              text={props.label}
              hasChanges={props.hasChanges}
            />
          )}
        </View>
        {props.inline && <View style={styles.input}>{props.children}</View>}
      </View>
      {!props.inline && (
        <View style={styles.inputs}>
          <View style={styles.input}>{props.children}</View>
          {props.handleClear && (
            <IconButton
              style={styles.clear}
              icon="cancel"
              variant="transparent"
              size={36}
              onPress={props.handleClear}
            />
          )}
        </View>
      )}

      {props.subLabel !== undefined && (
        <ThemedText type="body2" style={styles.subLabel}>
          {/* Always allow spacing so things don't pop in/out */}
          {props.subLabel ?? " "}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
  },
  mainLabels: {
    flexDirection: "row",
    flex: 1,
  },
  subLabel: {
    opacity: 0.5,
    marginTop: 5,
  },
  checkbox: {
    marginRight: 10,
  },
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
