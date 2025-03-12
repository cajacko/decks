import {
  TemplateDataId as DataId,
  TemplateId as Id,
  FieldType,
  ValidatedValue,
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
export type DataItem<T extends FieldType = FieldType> = {
  [K in FieldType]: {
    id: DataId;
    name: string;
    description?: string;
    type: K;
    defaultValidatedValue?: ValidatedValue<K>;
  };
}[T];

// export type Data<DataIds extends DataId = DataId> = {
//   [Id in DataIds]: LooseDataItem<FieldType, Id>;
// };

export type Data = Record<DataId, DataItem | undefined>;

export interface Props {
  templateId: Id;
  name: string;
  description?: string;
  schemaOrder?: DataId[];
  schema: Data;
  markup: Markup;
}

export interface State {
  templatesById: Record<Id, Props | undefined>;
}
