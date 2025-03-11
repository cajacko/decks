import { Templates } from "@/store/types";
import text from "@/constants/text";

/**
 * These are general purpose ID's that we expect people to use in their Google Sheets and their
 * templates, they should be semantic and not change. Templates can use these to pick up data
 * automatically for what they think they should be.
 */
export enum ReservedDataSchemaIds {
  Title = "title",
  Description = "description",
  Color = "color", // This describes the whole color theme of the card
  Emoji = "emoji",
}

export const reservedDataSchemaItems = {
  [ReservedDataSchemaIds.Title]: {
    id: ReservedDataSchemaIds.Title,
    name: text["template.reserved_data_item.title.name"],
    type: "text",
    description: text["template.reserved_data_item.title.description"],
  },
  [ReservedDataSchemaIds.Description]: {
    id: ReservedDataSchemaIds.Description,
    name: text["template.reserved_data_item.description.name"],
    type: "text",
    description: text["template.reserved_data_item.description.description"],
  },
  [ReservedDataSchemaIds.Color]: {
    id: ReservedDataSchemaIds.Color,
    name: text["template.reserved_data_item.color.name"],
    type: "color",
    description: text["template.reserved_data_item.color.description"],
  },
  [ReservedDataSchemaIds.Emoji]: {
    id: ReservedDataSchemaIds.Emoji,
    name: text["template.reserved_data_item.emoji.name"],
    type: "text",
    description: text["template.reserved_data_item.emoji.description"],
  },
} as const satisfies Templates.Data;
