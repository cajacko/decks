import React from "react";
import { Text, View } from "react-native";
import { MarkupElementProps, MarkupChildrenProps } from "./Template.types";
import useConvertStyles, { replaceVariables } from "./useConvertStyles";
import { useTemplateDataItem } from "./TemplateContext";

export function MarkupChildren(props: MarkupChildrenProps): React.ReactNode {
  return props.elements.map((element, i) => (
    <MarkupElement key={i} element={element} />
  ));
}

export default function MarkupElement({
  element,
}: MarkupElementProps): React.ReactNode {
  const { values } = useTemplateDataItem();
  const convertStyles = useConvertStyles(values);

  if (element.conditional) {
    const conditionalValue = values[element.conditional];

    // Any falsy value will not render the element
    if (!conditionalValue) return null;
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
          {replaceVariables(element.text, values)}
        </Text>
      );
    }
    default:
      throw new Error(`No element type in template`);
  }
}
