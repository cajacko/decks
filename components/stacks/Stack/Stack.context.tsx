import React, { createContext } from "react";
import { Dimensions } from "react-native";
import { StackDimensions } from "@/components/stacks/Stack/stack.types";
import { getStackDimensions } from "@/components/stacks/Stack/stack.style";
import AppError from "@/classes/AppError";
import { PhysicalMeasuresProvider } from "@/components/cards/context/PhysicalMeasures";
import {
  useCardsPhysicalSize,
  UseCardsPhysicalSizeProps,
} from "@/components/cards/context/CardPhysicalSize";
import { defaultCardDimensions } from "@/constants/cardDimensions";
import { CardTargetProvider } from "@/components/cards/context/CardTarget";

export type StackContextProps = StackDimensions;

export const Context = createContext<StackContextProps | undefined>(undefined);

export function useStackContext(): StackContextProps {
  const context = React.useContext(Context);

  return React.useMemo<StackContextProps>((): StackContextProps => {
    if (context) return context;

    new AppError(
      "Stack context not found, providing defaults, things will not be working fully",
    ).log("error");

    const dimensions = Dimensions.get("window");

    return {
      ...getStackDimensions({
        availableHeight: dimensions.height,
        availableWidth: dimensions.width,
        physicalSize: defaultCardDimensions,
      }),
    };
  }, [context]);
}

export function useOptionalStackContext(): StackContextProps | undefined {
  return React.useContext(Context);
}

export interface StackProviderProps
  extends Omit<UseCardsPhysicalSizeProps, "debugLocation"> {
  availableHeight: number;
  availableWidth: number;
  children: React.ReactNode;
}

export function StackProvider({
  children,
  availableHeight,
  availableWidth,
  ...useCardsPhysicalSizeProps
}: StackProviderProps) {
  const physicalSize = useCardsPhysicalSize({
    debugLocation: StackProvider.name,
    ...useCardsPhysicalSizeProps,
  });

  const value = React.useMemo(
    () =>
      getStackDimensions({
        availableHeight,
        availableWidth,
        physicalSize,
      }),
    [availableHeight, availableWidth, physicalSize],
  );

  return (
    <Context.Provider value={value}>
      <CardTargetProvider
        target={useCardsPhysicalSizeProps.target ?? null}
        inheritIfNull
      >
        <PhysicalMeasuresProvider {...value.scale}>
          {children}
        </PhysicalMeasuresProvider>
      </CardTargetProvider>
    </Context.Provider>
  );
}
