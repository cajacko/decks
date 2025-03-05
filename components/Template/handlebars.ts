import Handlebars from "handlebars";
import { Values } from "./Template.types";
import Color from "color";
import AppError from "@/classes/AppError";

const colorHelpers = [
  "lighten",
  "darken",
  "whiten",
  "blacken",
  "lightness",
] satisfies (keyof Color)[];

type ColorFunctionKeys = (typeof colorHelpers)[number];

function customFunction<N extends ColorFunctionKeys>(name: N): `color-${N}` {
  return `color-${name}`;
}

export function colorFunction(
  name: ColorFunctionKeys,
  dataValueId: string,
  param: number,
): string {
  return `{{${customFunction(name)} ${dataValueId} ${param}}}`;
}

function init() {
  colorHelpers.forEach((colorHelper) => {
    Handlebars.registerHelper(
      customFunction(colorHelper),
      function (value, param) {
        try {
          const color = Color(value);
          const processed = color[colorHelper](param);

          return processed.hex();
        } catch (unknownError) {
          AppError.getError(
            unknownError,
            `Handlebars.registerHelper call encountered an error`,
            {
              value,
              param,
            },
          ).log("debug");

          return value;
        }
      },
    );
  });
}

init();

export function replaceVariables(text: string, values: Values): string {
  const template = Handlebars.compile(text, { noEscape: true });

  return template(values);
}
