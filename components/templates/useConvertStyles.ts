/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Markup } from "@/store/types";
import { MmToDp, useMmToDp } from "@/components/cards/context/PhysicalMeasures";
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
] satisfies (keyof Markup.TemplateAllStyles)[];

export const variableRegex = /{{(.*?)}}/;

const numberTemplateProps = {
  fontSize: true,
} satisfies { [K in Markup.NumberTemplateProps]: true };

function replaceStylesVariables<S extends Markup.TemplateValidStyles>({
  cacheKey,
  style,
  values,
}: {
  style: S;
  values: Values;
  cacheKey: string;
}): S {
  const newStyle: S = { ...style };

  for (const key in style) {
    const value = style[key];

    if (typeof value === "string") {
      const match = value.match(variableRegex);

      if (match) {
        const newValue: string = replaceVariables({
          text: value,
          values: values,
          cacheKey: cacheKey,
        });

        newStyle[key] = newValue as any;
      }
    }
  }

  return newStyle;
}

function templateStyleToRnStyle<S extends Markup.TemplateValidStyles>(
  style: S,
  _key: keyof S,
): Markup.AllRnStyles {
  const key = _key as Markup.NumberTemplateProps;

  let value = style[_key];

  if (typeof value !== "string") return { [key]: value } as any;
  if (!numberTemplateProps[key]) return { [key]: value } as any;

  const number = parseFloat(value as string);

  if (isNaN(number)) return {};

  return { [key]: number } as any;
}

function templateStylesToRnStyles<S extends Markup.TemplateValidStyles>(
  style: S,
): Markup.TemplateStyleToRnStyle<S> {
  let newStyle: Markup.TemplateStyleToRnStyle<S> = {};

  for (const key in style) {
    newStyle = {
      ...newStyle,
      ...templateStyleToRnStyle(style, key),
    };
  }

  return newStyle;
}

function mmStylesToDp<S extends Markup.TemplateStyleToRnStyle>(
  style: S,
  mmToDp: MmToDp,
): S {
  const newStyle: S = { ...style };

  for (const key in style) {
    const value = style[key];

    if (typeof value === "number" && distanceProperties.includes(key)) {
      const newValue: number = mmToDp(value);

      newStyle[key] = newValue as any;
    }
  }

  return newStyle;
}

export default function useConvertStyles(props: {
  values?: Values | null;
  cacheKey: string;
}) {
  const mmToDp = useMmToDp();

  /**
   * All distance values in these style objects are defined in mm, we need to convert them to dp in
   * a performant way
   */
  return React.useCallback(
    <S extends Markup.TemplateValidStyles>(
      style?: S,
    ): Markup.TemplateStyleToRnStyle<S> | undefined => {
      if (!style) return undefined;

      const convertedStyles = props.values
        ? replaceStylesVariables({
            style,
            values: props.values,
            cacheKey: props.cacheKey,
          })
        : style;

      const rnStyles = templateStylesToRnStyles(convertedStyles);

      return mmStylesToDp(rnStyles, mmToDp);
    },
    [mmToDp, props.values, props.cacheKey],
  );
}
