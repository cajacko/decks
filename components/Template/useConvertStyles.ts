import React from "react";
import { Templates } from "@/store/types";
import { usePhysicalMeasures } from "@/context/PhysicalMeasures";
import { Values } from "./Template.types";
import { replaceVariables } from "./handlebars";

const distanceProperties: string[] = [
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
  "lineHeight",
] satisfies (keyof Templates.AllStyles)[];

export const variableRegex = /{{(.*?)}}/;

export default function useConvertStyles(props: {
  values?: Values | null;
  cacheKey: string;
}) {
  const { mmToDp } = usePhysicalMeasures();

  /**
   * All distance values in these style objects are defined in mm, we need to convert them to dp in
   * a performant way
   */
  return React.useCallback(
    <S extends Templates.ValidStyles>(style?: S): S | undefined => {
      if (!style) return undefined;

      const newStyle: S = { ...style };

      for (const key in newStyle) {
        const value = newStyle[key];

        if (typeof value === "number" && distanceProperties.includes(key)) {
          const newValue: number = mmToDp(value);

          // This is been a bit annoying so ignoring
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          newStyle[key] = newValue as any;
        } else if (typeof value === "string") {
          if (props.values) {
            const match = value.match(variableRegex);

            if (match) {
              const newValue: string = replaceVariables({
                text: value,
                values: props.values,
                cacheKey: props.cacheKey,
              });

              // This is been a bit annoying so ignoring
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              newStyle[key] = newValue as any;
            }
          }
        }
      }

      return newStyle;
    },
    [mmToDp, props.values, props.cacheKey],
  );
}
