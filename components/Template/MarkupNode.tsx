import React from "react";
import { Text, View } from "react-native";
import { MarkupNodeProps, MarkupChildrenProps } from "./Template.types";
import useConvertStyles from "./useConvertStyles";
import { replaceVariables, conditional } from "./handlebars";
import { useTemplateDataItem } from "./TemplateContext";
import AppError from "@/classes/AppError";

export function MarkupChildren(props: MarkupChildrenProps): React.ReactNode {
  return props.nodes.map((node, i) => (
    <MarkupNode key={i} node={node} cacheKey={props.cacheKey} />
  ));
}

export default function MarkupNode({
  node,
  cacheKey,
}: MarkupNodeProps): React.ReactNode {
  const values = useTemplateDataItem();
  const convertStyles = useConvertStyles({ values, cacheKey });

  if (
    node.conditional &&
    !conditional({
      cacheKey,
      conditional: node.conditional,
      values,
    })
  ) {
    return null;
  }

  switch (node.type) {
    case "View":
      return (
        <View style={convertStyles(node.style)}>
          {node.children && (
            <MarkupChildren nodes={node.children} cacheKey={cacheKey} />
          )}
        </View>
      );
    case "Text": {
      return (
        <Text style={convertStyles(node.style)}>
          {values
            ? replaceVariables({ text: node.text, values, cacheKey })
            : node.text}
        </Text>
      );
    }
    default:
      new AppError(
        `${MarkupNode.name}: Unknown/ unhandled element type, returning null`,
        node,
      ).log("error");

      return null;
  }
}
