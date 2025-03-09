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
  subTitleProps?: Partial<ThemedTextProps>;
  subTitle?: string;
  itemSpacing?: number;
}

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

  const titleProps = React.useMemo(
    (): Partial<ThemedTextProps> => ({
      type: "h3",
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
});
