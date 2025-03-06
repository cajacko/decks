import { Templates } from "@/store/types";

export type Data = Templates.Data;

export interface TemplateProps<D extends Data = Data> {
  values?: Values | null;
  markup: Templates.Markup<D>;
}

export interface MarkupElementProps {
  element: Templates.MarkupElement<Data>;
  cacheKey: string;
}

export interface MarkupChildrenProps {
  elements: Templates.MarkupElement<Data>[];
  cacheKey: string;
}

export type DeckValues = null | {
  name: string;
};

export type Values = {
  [Key: string]: string | number | boolean | undefined | null | Values;
};

export type TemplateContext = Values;
