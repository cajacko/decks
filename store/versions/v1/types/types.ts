/**
 * This file handles any shared types. Individual files may re-export to make things make more
 * semantic sense
 *
 * We explicitly name ID's just to make it clearer going forwards which ID/KEy is being used in
 * different maps
 */

/**
 * Indicates the id of a piece of data that lives on the card e.g. The title of the card might have
 * the ID "title" and live on card.data.title. This may also be set on the deck as default card data.
 * It is not an id defined in the templates
 */
export type CardDataId = string;
export type CardId = string;
export type DeckId = string;
export type TemplateId = string;
export type TabletopId = string;
export type StackId = string;
export type CardInstanceId = string;
export type TemplateDataId = string;

export type CardSide = "front" | "back";

/**
 * All the supported card size presets
 */
export enum CardSize {
  Poker = "poker",
}

// Value Types for templates/ data on cards/ deck defaults etc
export type FieldType = "text" | "color" | "number" | "boolean";
export type ValueType = FieldType | "null";

// Gives us some safety that the value has already been checked. e.g. text and colours are both
// strings, we don't want to accidentally map a text to a colour when a user remaps a template
// because we saw them both as strings
type CreateValidatedValue<Type extends ValueType, Value> = {
  type: Type;
  value: Value;
};

export type ValidatedValue<Type extends FieldType = FieldType> =
  | {
      text: CreateValidatedValue<"text", string>;
      color: CreateValidatedValue<"color", string>;
      number: CreateValidatedValue<"number", number>;
      boolean: CreateValidatedValue<"boolean", boolean>;
    }[Type]
  | CreateValidatedValue<"null", null>;
