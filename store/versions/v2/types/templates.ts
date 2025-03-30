import {
  TemplateDataId as DataId,
  TemplateId as Id,
  FieldType,
  ValidatedValue,
  DateString,
} from "./types";
import { Nodes as Markup } from "./markup";

export type { DataId, Id, FieldType, ValidatedValue, Markup };

// Helper type to get the value type of a schema item. We mainly use DataItem which is stricter and
// ensures that event if T = ValueType, the type and defaultValue must still match e.g.
// const example: TemplateData = {
//   test: {
//     id: "yo",
//     type: ValueType.Color,
//     // NOTE: If CreateDataItem is used instead of DataItem this won't raise an error
//     defaultValue: "hi",
//   },
// };
export type DataItem<
  T extends FieldType = FieldType,
  DID extends DataId = DataId,
> = {
  [K in FieldType]: {
    id: DID;
    name: string;
    description?: string;
    type: K;
    defaultValidatedValue?: ValidatedValue<K>;
  };
}[T];

export type Data<DID extends DataId = DataId> = {
  [Key in DID]: DataItem<FieldType, Key>;
};

// Allowing to pass in the data id lets us validate our prebuilt decks that are defined in the code
export interface Props<DID extends DataId = DataId> {
  templateId: Id;
  name: string;
  description?: string;
  schemaOrder?: DID[];
  schema: Data<DID>;
  markup: Markup;
  dateCreated: DateString;
  dateUpdated: DateString;
}

export interface State {
  templatesById: Record<Id, Props | undefined>;
}
