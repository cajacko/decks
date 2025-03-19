import React, { createContext } from "react";
import { Dimensions } from "react-native";
import { StackDimensions } from "@/components/Stack/stack.types";
import { getStackDimensions } from "@/components/Stack/stack.style";
import AppError from "@/classes/AppError";
import { PhysicalMeasuresProvider } from "../cards/context/PhysicalMeasures";
import { useCardsPhysicalSize } from "@/components/cards/context/CardPhysicalSize";
import { defaultCardDimensions } from "@/constants/cardDimensions";
import {
  Target,
  CardTargetProvider,
} from "@/components/cards/context/CardTarget";

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
        physicalSize: defaultCardDimensions,
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
  availableHeight: number;
  availableWidth: number;
  children: React.ReactNode;
  tabletopId: string;
  deckId: string;
  target: Target;
}

export function TabletopProvider({
  children,
  availableHeight,
  availableWidth,
  tabletopId,
  deckId,
  target,
}: TabletopProviderProps) {
  const physicalSize = useCardsPhysicalSize({
    target,
    debugLocation: TabletopProvider.name,
  });

  const stackDimensions = React.useMemo(
    () =>
      getStackDimensions({
        availableHeight,
        availableWidth,
        physicalSize,
      }),
    [availableHeight, availableWidth, physicalSize],
  );

  const value = React.useMemo(
    () => ({
      ...stackDimensions,
      tabletopId,
      deckId,
    }),
    [stackDimensions, tabletopId, deckId],
  );

  return (
    <Context.Provider value={value}>
      <CardTargetProvider target={target}>
        <PhysicalMeasuresProvider {...stackDimensions.scale}>
          {children}
        </PhysicalMeasuresProvider>
      </CardTargetProvider>
    </Context.Provider>
  );
}

/**
 * For when you want to use the same card size as being used in the tabletop
 */
export function TabletopCardSizeProvider(
  props: Pick<
    TabletopProviderProps,
    "availableHeight" | "availableWidth" | "children" | "target"
  >,
) {
  // We're only using this for the card size so we don't need to worry about the tabletopId or
  // deckId right now, would be nice to refactor this to be more generic
  return <TabletopProvider {...props} deckId="" tabletopId="" />;
}
