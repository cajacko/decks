/**
 * Your one stop shop for resolving card data. All utils/ selectors etc should come from this file/
 * dir. So we keep all that logic in one central location
 */
import { Values as TemplateValuesMap } from "@/components/Template/Template.types";

// TODO: With origin
// type ValueOrigin = "card" | "deck" | "template" | "template-map";
// export type ValidatedValue =

export type Deck = {};

export type Card = {};

export type Template = {};

export type EditingData = {};

export interface ResolveCardDataProps {
  deck: Deck | null;
  card: Card;
  templates: {
    front: Template;
    back: Template;
  };
  editing: EditingData;
}

// interface CardValue {
//   card
// }

export interface ResolvedCardData {
  /**
   * For the CardTemplate component to use and display values on a card
   */
  templateValuesMap: TemplateValuesMap;
}

export default function resolveCardData(props: ResolveCardDataProps) {}
