import React from "react";
// import ThemedText from "./ThemedText";
import { View, ViewStyle, StyleSheet } from "react-native";
import Collapsible, { CollapsibleProps } from "../ui/Collapsible";
import { ThemedTextProps } from "../ui/ThemedText";

export interface FieldSetProps
  extends Pick<
    CollapsibleProps,
    | "collapsed"
    | "onCollapse"
    | "initialCollapsed"
    | "collapsible"
    | "titleProps"
    | "subTitleProps"
    | "subTitle"
    | "title"
  > {
  children?: React.ReactNode;
  style?: ViewStyle;
  itemSpacing?: number;
}

export const titleProps: CollapsibleProps["titleProps"] = {
  type: "h3",
};

export default function FieldSet({
  title,
  children: childrenProp,
  style,
  collapsible = false,
  titleProps: titlePropsProp,
  subTitle,
  subTitleProps: subTitlePropsProp,
  itemSpacing = 30,
  ...props
}: FieldSetProps): React.ReactNode {
  const children = React.useMemo(() => {
    let hasProcessedFirst = false;

    return React.Children.map(childrenProp, (child) => {
      if (!child) return;

      const isFirst = !hasProcessedFirst;

      if (isFirst) {
        hasProcessedFirst = true;
      }

      return (
        <View
          style={StyleSheet.flatten([
            styles.field,
            !isFirst && { marginTop: itemSpacing },
          ])}
        >
          {child}
        </View>
      );
    });
  }, [childrenProp, itemSpacing]);

  const _titleProps = React.useMemo(
    (): CollapsibleProps["titleProps"] => ({
      ...titleProps,
      ...titlePropsProp,
    }),
    [titlePropsProp],
  );

  const subTitleProps = React.useMemo(
    (): Partial<ThemedTextProps> => ({
      type: "h4",
      ...subTitlePropsProp,
    }),
    [subTitlePropsProp],
  );

  return (
    <Collapsible
      title={title}
      style={style}
      collapsible={collapsible}
      headerStyle={styles.title}
      subTitle={subTitle}
      {...props}
      subTitleProps={subTitleProps}
      titleProps={_titleProps}
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
});
