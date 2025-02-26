import React from "react";
import { TemplateProps, Data } from "./Template.types";
import { MarkupChildren } from "./MarkupElement";
import { TemplateProvider } from "./TemplateContext";

export default function Template<D extends Data>({
  values,
  markup,
}: TemplateProps<D>): React.ReactNode {
  return (
    <TemplateProvider values={values ?? null}>
      <MarkupChildren elements={markup} />
    </TemplateProvider>
  );
}
