import React from "react";
import { Text, View } from "react-native";
import { MarkupElementProps, MarkupChildrenProps } from "./Template.types";
import useConvertStyles from "./useConvertStyles";

export function MarkupChildren(props: MarkupChildrenProps): React.ReactNode {
  return props.elements.map((element) => (
    <MarkupElement key={element.id} element={element} />
  ));
}

export default function MarkupElement({
  element,
}: MarkupElementProps): React.ReactNode {
  const convertStyles = useConvertStyles();

  switch (element.type) {
    case "view":
      return (
        <View style={convertStyles(element.style)}>
          {element.children && <MarkupChildren elements={element.children} />}
        </View>
      );
    case "text":
      return <Text style={convertStyles(element.style)}>{element.text}</Text>;
    default:
      throw new Error(`No element type in template`);
  }
}
