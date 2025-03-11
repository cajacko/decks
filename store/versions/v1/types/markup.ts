import { TextStyle, ViewStyle } from "react-native";

type NodeType = "View" | "Text";

export type { ViewStyle, TextStyle };

export type ValidStyles = TextStyle | ViewStyle;
export type AllStyles = TextStyle & ViewStyle;

/**
 * A handlebar string that can be used to conditionally render a node, so can access template
 * variables etc
 */
type Conditional = string;

/**
 * Add generics that apply to all nodes here
 */
type CreateMarkupElementHelper<
  T extends NodeType,
  P extends { style?: ValidStyles },
> = {
  type: T;
  conditional?: Conditional;
} & P;

type View = CreateMarkupElementHelper<
  "View",
  {
    children?: Node[];
    style?: ViewStyle;
  }
>;

type Text = CreateMarkupElementHelper<
  "Text",
  { text: string; style?: TextStyle }
>;

export type Node = View | Text;

export type Nodes = Node[];
