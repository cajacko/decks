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
  Handlebars.registerHelper("equals", function (value1, value2) {
    if (value1 === value2) return "true";
    if (String(value1) === String(value2)) return "true";

    return false;
  });

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

function isConditionTrue(condition: unknown): boolean {
  const string = String(condition).trim().toLowerCase();

  switch (string) {
    case "":
    case "false":
    case "null":
    case "undefined":
      return false;
  }

  return true;
}

export function conditional(
  conditional: string,
  values: Values | null,
): boolean {
  // Check if we just passed a data value id. If so check if that's truthy
  const conditionalDataValue = values?.[conditional];

  if (conditionalDataValue !== undefined) {
    return isConditionTrue(conditionalDataValue);
  }

  // If the conditional is a string, we need to check if it's a truthy value when ran through
  // handlebars

  const template = Handlebars.compile(conditional, { noEscape: true });

  return isConditionTrue(template(values));
}
