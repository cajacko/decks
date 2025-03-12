export type MenuItem<P extends object = object> = P & {
  key: string;
  top: number;
  left: number;
  height: number;
  width: number;
  touchBuffer?: number;
};

export type RenderItemMenuItem<P extends MenuItem> = P & {
  highlight: boolean;
  holdMenuBehaviour: "hold" | "always-visible";
};

export interface HoldMenuProps<I extends MenuItem> {
  renderItem: (item: RenderItemMenuItem<I>) => React.ReactNode;
  handleAction: (item: I) => void;
  handlePress?: () => void;
  menuItems: I[];
  touchBuffer?: number;
}
