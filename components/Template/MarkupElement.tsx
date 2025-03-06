import React from "react";
import { Text, View } from "react-native";
import { MarkupElementProps, MarkupChildrenProps } from "./Template.types";
import useConvertStyles from "./useConvertStyles";
import { replaceVariables, conditional } from "./handlebars";
import { useTemplateDataItem } from "./TemplateContext";
import AppError from "@/classes/AppError";

export function MarkupChildren(props: MarkupChildrenProps): React.ReactNode {
  return props.elements.map((element, i) => (
    <MarkupElement key={i} element={element} />
  ));
}

export default function MarkupElement({
  element,
}: MarkupElementProps): React.ReactNode {
  const values = useTemplateDataItem();
  const convertStyles = useConvertStyles(values);

  if (element.conditional && !conditional(element.conditional, values)) {
    return null;
  }

  switch (element.type) {
    case "view":
      return (
        <View style={convertStyles(element.style)}>
          {element.children && <MarkupChildren elements={element.children} />}
        </View>
      );
    case "text": {
      return (
        <Text style={convertStyles(element.style)}>
          {values ? replaceVariables(element.text, values) : element.text}
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
