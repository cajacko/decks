import React from "react";
import { Text, View } from "react-native";
import { MarkupElementProps, MarkupChildrenProps } from "./Template.types";

export function MarkupChildren(props: MarkupChildrenProps): React.ReactNode {
  return props.elements.map((element) => (
    <MarkupElement key={element.id} element={element} />
  ));
}

export default function MarkupElement({
  element,
}: MarkupElementProps): React.ReactNode {
  switch (element.type) {
    case "view":
      return (
        <View>
          {element.children && <MarkupChildren elements={element.children} />}
        </View>
      );
    case "text":
      return <Text>{element.text}</Text>;
    default:
      throw new Error(`No element type in template`);
  }
}
