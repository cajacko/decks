import React, { createContext } from "react";
import { Dimensions } from "react-native";
import { StackDimensions } from "@/components/Stack/stack.types";
import { getStackDimensions } from "@/components/Stack/stack.style";
import { CardMMDimensions } from "@/components/Card/Card.types";
import AppError from "@/classes/AppError";
import { defaultCardDimensions } from "@/components/Card/cardSizes";

export type TabletopContextProps = StackDimensions & {
  tabletopId: string;
  // Only one for now, refactor and figure out how to handle more when we need to change it
  deckId: string;
};

export const Context = createContext<TabletopContextProps | undefined>(
  undefined,
);

export function useTabletopContext(): TabletopContextProps {
  const context = React.useContext(Context);

  return React.useMemo<TabletopContextProps>((): TabletopContextProps => {
    if (context) return context;

    new AppError(
      "Tabletop context not found, providing defaults, things will not be working fully",
    ).log("error");

    const dimensions = Dimensions.get("window");

    return {
      ...getStackDimensions({
        availableHeight: dimensions.height,
        availableWidth: dimensions.width,
        cardProportions: defaultCardDimensions,
      }),
      tabletopId: "",
      deckId: "",
    };
  }, [context]);
}

export function useOptionalTabletopContext(): TabletopContextProps | undefined {
  return React.useContext(Context);
}

export interface TabletopProviderProps {
  children:
    | React.ReactNode
    | ((context: TabletopContextProps) => React.ReactNode);
  availableHeight: number;
  availableWidth: number;
  tabletopId: string;
  cardProportions: CardMMDimensions;
  deckId: string;
}

export function TabletopProvider({
  children,
  availableHeight,
  availableWidth,
  tabletopId,
  cardProportions,
  deckId,
}: TabletopProviderProps) {
  const value = React.useMemo(
    () => ({
      ...getStackDimensions({
        availableHeight,
        availableWidth,
        cardProportions,
      }),
      tabletopId,
      deckId,
    }),
    [availableHeight, availableWidth, tabletopId, cardProportions, deckId],
  );

  const child = React.useMemo(
    () => (typeof children === "function" ? children(value) : children),
    [children, value],
  );

  return <Context.Provider value={value}>{child}</Context.Provider>;
}
