import { TextStyle as _TextStyle, ViewStyle as _ViewStyle } from "react-native";

type NodeType = "View" | "Text";

export type NumberTemplateProps = "fontSize";

type ValidRnStyles = _TextStyle | _ViewStyle;
export type AllRnStyles = _TextStyle & _ViewStyle;

//
type RnStyleToTemplateStyle<T extends ValidRnStyles> = {
  [K in keyof T]: K extends NumberTemplateProps ? number | string : T[K];
};

export type TemplateTextStyle = RnStyleToTemplateStyle<_TextStyle>;
export type TemplateViewStyle = RnStyleToTemplateStyle<_ViewStyle>;

export type TemplateValidStyles = TemplateTextStyle | TemplateViewStyle;
export type TemplateAllStyles = TemplateTextStyle & TemplateViewStyle;

export type TemplateStyleToRnStyle<
  T extends TemplateValidStyles = TemplateValidStyles,
> = T extends TemplateTextStyle ? _TextStyle : _ViewStyle;

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
  P extends { style?: TemplateValidStyles },
> = {
  type: T;
  conditional?: Conditional;
} & P;

type View = CreateMarkupElementHelper<
  "View",
  {
    children?: Node[];
    style?: TemplateViewStyle;
  }
>;

type Text = CreateMarkupElementHelper<
  "Text",
  { text: string; style?: TemplateTextStyle }
>;

export type Node = View | Text;

export type Nodes = Node[];
