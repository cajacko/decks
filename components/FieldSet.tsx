import React from "react";
// import ThemedText from "./ThemedText";
import { View, ViewStyle, StyleSheet } from "react-native";
import Collapsible, { CollapsibleProps } from "./Collapsible";
import { ThemedTextProps } from "./ThemedText";

export interface FieldSetProps
  extends Pick<
    CollapsibleProps,
    "collapsed" | "onCollapse" | "initialCollapsed" | "collapsible"
  > {
  title?: string | null;
  children?: React.ReactNode;
  style?: ViewStyle;
  titleProps?: Partial<ThemedTextProps>;
}

export default function FieldSet({
  title,
  children: childrenProp,
  style,
  collapsible = false,
  titleProps: titlePropsProp,
  ...props
}: FieldSetProps): React.ReactNode {
  const children = React.useMemo(
    () =>
      React.Children.map(childrenProp, (child, i) => (
        <View
          style={StyleSheet.flatten([
            styles.field,
            i !== 0 && styles.fieldSpacing,
          ])}
        >
          {child}
        </View>
      )),
    [childrenProp],
  );

  const titleProps = React.useMemo(
    (): Partial<ThemedTextProps> => ({
      type: "h3",
      style: styles.title,
      ...titlePropsProp,
    }),
    [titlePropsProp],
  );

  return (
    <Collapsible
      title={title}
      style={style}
      collapsible={collapsible}
      {...props}
      titleProps={titleProps}
    >
      {children}
    </Collapsible>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
  field: {},
  fieldSpacing: {
    marginTop: 16,
  },
});
