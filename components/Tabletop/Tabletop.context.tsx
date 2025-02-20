import React, { createContext } from "react";
import { Dimensions } from "react-native";
import { StackDimensions } from "@/components/Stack/stack.types";
import { getStackDimensions } from "@/components/Stack/stack.style";

export type TabletopContextProps = StackDimensions & { tabletopId: string };

const size = Dimensions.get("screen");

const initialContext = {
  ...getStackDimensions({
    availableHeight: size.height,
    availableWidth: size.width,
  }),
  tabletopId: "",
};

export const Context = createContext<TabletopContextProps>(initialContext);

export function useTabletopContext() {
  return React.useContext(Context);
}

export function TabletopProvider({
  children,
  height,
  width,
  tabletopId,
}: {
  children:
    | React.ReactNode
    | ((context: TabletopContextProps) => React.ReactNode);
  height: number;
  width: number;
  tabletopId: string;
}) {
  const value = React.useMemo(
    () => ({
      ...getStackDimensions({ availableHeight: height, availableWidth: width }),
      tabletopId,
    }),
    [height, width, tabletopId]
  );

  const child = React.useMemo(
    () => (typeof children === "function" ? children(value) : children),
    [children, value]
  );

  return <Context.Provider value={value}>{child}</Context.Provider>;
}
