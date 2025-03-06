import React from "react";
import { Text, View } from "react-native";
import { MarkupElementProps, MarkupChildrenProps } from "./Template.types";
import useConvertStyles from "./useConvertStyles";
import { replaceVariables, conditional } from "./handlebars";
import { useTemplateDataItem } from "./TemplateContext";
import AppError from "@/classes/AppError";

export function MarkupChildren(props: MarkupChildrenProps): React.ReactNode {
  return props.elements.map((element, i) => (
    <MarkupElement key={i} element={element} cacheKey={props.cacheKey} />
  ));
}

export default function MarkupElement({
  element,
  cacheKey,
}: MarkupElementProps): React.ReactNode {
  const values = useTemplateDataItem();
  const convertStyles = useConvertStyles({ values, cacheKey });

  if (
    element.conditional &&
    !conditional({
      cacheKey,
      conditional: element.conditional,
      values,
    })
  ) {
    return null;
  }

  switch (element.type) {
    case "view":
      return (
        <View style={convertStyles(element.style)}>
          {element.children && (
            <MarkupChildren elements={element.children} cacheKey={cacheKey} />
          )}
        </View>
      );
    case "text": {
      return (
        <Text style={convertStyles(element.style)}>
          {values
            ? replaceVariables({ text: element.text, values, cacheKey })
            : element.text}
        </Text>
      );
    }
    default:
      new AppError(
        `${MarkupElement.name}: Unknown/ unhandled element type, returning null`,
        element,
      ).log("error");

      return null;
  }
}
