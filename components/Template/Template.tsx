import React from "react";
import { TemplateProps, Data } from "./Template.types";
import { MarkupChildren } from "./MarkupElement";
import { TemplateProvider } from "./TemplateContext";

export default function Template<D extends Data>({
  data,
  markup,
}: TemplateProps<D>): React.ReactNode {
  return (
    <TemplateProvider data={data}>
      <MarkupChildren elements={markup} />
    </TemplateProvider>
  );
}
