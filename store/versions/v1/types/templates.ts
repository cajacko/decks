import { TextStyle, ViewStyle } from "react-native";

// Naming the types here makes it easier for us to know what string should be passed
export type DataItemId = string;
export type TemplateId = string;

export enum DataType {
  Text = "text",
  Color = "color",
}

// Gives us some safety that the value has already been checked. e.g. text and colours are both
// strings, we don't want to accidentally map a text to a colour when a user remaps a template
// because we saw them both as strings
export type ValidatedDataType<T extends DataType, V> = {
  value: V;
  type: T;
};

// Helper type to get the value type of a schema item, as some don't need to be validated (e.g.
// text) and some do (e.g. color)
type DataTypeValueMapHelper = {
  [DataType.Text]: ValidatedDataType<DataType.Text, string>;
  [DataType.Color]: ValidatedDataType<DataType.Color, string>;
};

export type DataValue<T extends DataType = DataType> =
  DataTypeValueMapHelper[T];

// Helper type to get the value type of a schema item. We mainly use DataItem which is stricter and
// ensures that event if T = DataType, the type and defaultValue must still match e.g.
// const example: TemplateData = {
//   test: {
//     id: "yo",
//     type: DataType.Color,
//     // NOTE: If CreateDataItem is used instead of DataItem this won't raise an error
//     defaultValue: "hi",
//   },
// };
type CreateDataItemHelper<
  T extends DataType = DataType,
  Id extends DataItemId = string,
> = {
  id: Id;
  type: T;
  value?: DataValue<T>;
  defaultValue?: DataValue<T>;
  name: string;
  description?: string;
};

export type DataItem<Id extends DataItemId> = {
  [T in DataType]: CreateDataItemHelper<T, Id>;
}[DataType];

export type Data<DataItemIds extends DataItemId = DataItemId> = {
  [Id in DataItemIds]: DataItem<Id>;
};

type MarkupElementType = "view" | "text";

export type ValidStyles = TextStyle | ViewStyle;
export type AllStyles = TextStyle & ViewStyle;

// NOTE: We could add conditional and loop nodes in here and rename Element to Node. That would
// better explain it all. A conditional node renders entire separate branches.

/**
 * This can be expanded to include more types of conditionals
 *
 * Id | { type: "=", condition: "{{templateItemId}}", value: "value" }
 */
type Conditional<Id extends DataItemId = DataItemId> = Id;

type CreateMarkupElementHelper<
  T extends MarkupElementType,
  P extends { style?: ValidStyles },
> = {
  type: T;
  conditional?: Conditional;
} & P;

type MarkupView<D extends Data> = CreateMarkupElementHelper<
  "view",
  {
    children?: MarkupElement<D>[];
    style?: ViewStyle;
  }
>;

type MarkupText = CreateMarkupElementHelper<
  "text",
  { text: string; style?: TextStyle }
>;

export type MarkupElement<D extends Data = Data> = MarkupView<D> | MarkupText;

export type Markup<D extends Data = Data> = MarkupElement<D>[];

export interface Props<
  DataItemIds extends DataItemId = DataItemId,
  D extends Data<DataItemIds> = Data<DataItemIds>,
> {
  templateId: TemplateId;
  name: string;
  description?: string;
  schemaOrder: DataItemIds[];
  schema: D;
  markup: Markup<D>;
}

export interface State {
  templatesById: Record<string, Props | undefined>;
}
