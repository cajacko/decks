import React, { createContext } from "react";
import AppError from "@/classes/AppError";
import {
  Target,
  CardTargetProvider,
} from "@/components/cards/context/CardTarget";

export type TabletopContextProps = {
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

    return {
      tabletopId: "",
      deckId: "",
    };
  }, [context]);
}

export function useOptionalTabletopContext(): TabletopContextProps | undefined {
  return React.useContext(Context);
}

export interface TabletopProviderProps {
  children: React.ReactNode;
  tabletopId: string;
  deckId: string;
  target: Target;
}

export function TabletopProvider({
  children,
  tabletopId,
  deckId,
  target,
}: TabletopProviderProps) {
  const value = React.useMemo(
    (): TabletopContextProps => ({
      tabletopId,
      deckId,
    }),
    [tabletopId, deckId],
  );

  return (
    <Context.Provider value={value}>
      <CardTargetProvider target={target}>{children}</CardTargetProvider>
    </Context.Provider>
  );
}
