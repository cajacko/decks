import React from "react";
import { Templates } from "@/store/types";
import { usePhysicalMeasures } from "@/context/PhysicalMeasures";
import Handlebars from "handlebars";
import { Values } from "./Template.types";

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
] satisfies (keyof Templates.AllStyles)[];

export const variableRegex = /{{(.*?)}}/;

export function replaceVariables(text: string, values: Values): string {
  const template = Handlebars.compile(text, { noEscape: true });

  return template(values);
}

export default function useConvertStyles(values?: Values | null) {
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
          if (values) {
            const match = value.match(variableRegex);

            if (match) {
              const newValue: string = replaceVariables(value, values);

              // This is been a bit annoying so ignoring
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              newStyle[key] = newValue as any;
            }
          }
        }
      }

      return newStyle;
    },
    [mmToDp, values],
  );
}
