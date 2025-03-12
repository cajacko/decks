export type MenuItem<P extends object = object> = P & {
  key: string;
  height: number;
  width: number;
};

export type RenderItemMenuItem<P extends MenuItem> = P & {
  highlight: boolean;
  holdMenuBehaviour: "hold" | "always-visible";
};

export type MenuPosition = "top" | "bottom" | "left" | "right";

export type MenuItems<P extends object = object> = {
  [K in MenuPosition]?: MenuItem<P>;
};

export interface HoldMenuProps<I extends MenuItem> {
  renderItem: (item: RenderItemMenuItem<I>) => React.ReactNode;
  handleAction: (item: I) => void;
  handlePress?: () => void;
  menuItems: MenuItems<I>;
  touchBuffer?: number;
}
