import { Templates } from "@/store/types";

export type Data = Templates.Data;

export type StyleProp = Templates.ValidStyles;

export interface TemplateProps<D extends Data> {
  data: D;
  markup: Templates.Markup<D>;
}

export interface MarkupElementProps {
  element: Templates.MarkupElement<Data>;
}

export interface MarkupChildrenProps {
  elements: Templates.MarkupElement<Data>[];
}

export type TemplateContext<D extends Data> = {
  data: D;
};
