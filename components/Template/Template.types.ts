import { Markup, Templates } from "@/store/types";

export interface TemplateProps {
  values?: Values | null;
  markup: Templates.Markup;
}

export interface MarkupNodeProps {
  node: Markup.Node;
  cacheKey: string;
}

export interface MarkupChildrenProps {
  nodes: Markup.Node[];
  cacheKey: string;
}

export type DeckValues = null | {
  name: string;
};

export type Values = {
  [Key: string]: string | number | boolean | undefined | null | Values;
};

export type TemplateContext = Values;
