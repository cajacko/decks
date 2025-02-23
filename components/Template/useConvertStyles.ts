import React from "react";
import { TextStyle, ViewStyle } from "react-native";
import { usePhysicalMeasures } from "@/context/PhysicalMeasures";
import { StyleProp } from "./Template.types";

const distanceProperties: (keyof TextStyle | keyof ViewStyle)[] = [
  "width",
  "height",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "marginVertical",
  "marginHorizontal",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "paddingVertical",
  "paddingHorizontal",
  "top",
  "right",
  "bottom",
  "left",
  "borderRadius",
  "borderWidth",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "fontSize",
];

export default function useConvertStyles() {
  const { mmToDp } = usePhysicalMeasures();

  /**
   * All distance values in these style objects are defined in mm, we need to convert them to dp in
   * a performant way
   */
  return React.useCallback(
    <S extends StyleProp>(style?: S): S | undefined => {
      if (!style) return undefined;

      const newStyle = { ...style };

      for (const property of distanceProperties) {
        const key = property as keyof S;

        if (typeof newStyle[key] === "number") {
          // @ts-ignore
          newStyle[key] = mmToDp(newStyle[key]);
        }
      }

      return newStyle;
    },
    [mmToDp],
  );
}
