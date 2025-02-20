export type MenuItem<P extends {} = {}> = P & {
  key: string;
  top: number;
  left: number;
  height: number;
  width: number;
  touchBuffer?: number;
};

export interface HoldMenuProps<I extends MenuItem> {
  renderItem: (
    item: I & {
      highlight: boolean;
      holdMenuBehaviour: "hold" | "tap";
    }
  ) => React.ReactNode;
  handleAction: (item: I) => void;
  menuItems: I[];
  touchBuffer?: number;
}
