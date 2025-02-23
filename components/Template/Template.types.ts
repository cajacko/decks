import { Templates } from "@/store/types";

export type Data = Templates.Data;

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

export type Values = Record<
  string,
  string | number | boolean | undefined | null
>;

export type TemplateContext<D extends Data> = {
  data: D;
  values: Values;
};
