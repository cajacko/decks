/**
 * When you want every card within the provider has the same physical dimensions
 */
import AppError from "@/classes/AppError";
import React from "react";
import { Cards } from "@/store/types";
import cardDimensions, {
  defaultCardDimensions,
  CardPhysicalSize,
} from "@/constants/cardDimensions";
import { useAppSelector } from "@/store/hooks";
import { selectCardSize } from "@/store/combinedSelectors/cards";
import { NullBehaviour } from "../types";
import { useCardTarget, Target, CardTargetProvider } from "@/utils/cardTarget";

export type { CardPhysicalSize };

export interface UseCardsPhysicalSizeProps {
  target?: Target;
  physicalSize?: CardPhysicalSize;
  sizePreset?: Cards.Size;
  debugLocation: string;
}

export interface CardPhysicalSizeProviderProps
  extends UseCardsPhysicalSizeProps {
  nullBehaviour?: NullBehaviour;
  children: React.ReactNode;
  inheritFromParent?: boolean;
}

type ContextState = CardPhysicalSize;

const Context = React.createContext<ContextState | null>(null);

function _useCardsPhysicalSize({
  physicalSize: physicalSizeProp,
  target: targetProp,
  sizePreset: sizePresetProp,
}: Omit<UseCardsPhysicalSizeProps, "debugLocation">):
  | CardPhysicalSize
  | undefined {
  const target = useCardTarget({ target: targetProp });

  const sizePreset =
    useAppSelector((state) =>
      target ? selectCardSize(state, target) : undefined,
    ) ?? sizePresetProp;

  const presetSize = sizePreset ? cardDimensions[sizePreset] : undefined;
  const physicalSize = physicalSizeProp ?? presetSize;

  return physicalSize;
}

export function useCardsPhysicalSize({
  debugLocation,
  ...props
}: UseCardsPhysicalSizeProps): CardPhysicalSize {
  const context = React.useContext(Context);
  const physicalSize = _useCardsPhysicalSize(props);

  if (physicalSize) return physicalSize;

  if (!context) {
    new AppError(
      `${useCardsPhysicalSize.name} (${debugLocation}) must be used within a ${CardTargetProvider.name} or a ${CardPhysicalSizeProvider.name} component or passed a custom size that resolves. Using fallback.`,
    ).log("warn");

    return defaultCardDimensions;
  }

  return context;
}

export function CardPhysicalSizeProvider({
  children,
  nullBehaviour = "log-and-fallback",
  inheritFromParent = false,
  ...props
}: CardPhysicalSizeProviderProps) {
  const parentContext = React.useContext(Context);
  let physicalSize = _useCardsPhysicalSize(props) ?? parentContext;

  if (inheritFromParent && parentContext) {
    physicalSize = parentContext;
  }

  // Just to not cause our memo to trigger more than it needs to
  const logProps = React.useRef(props);
  logProps.current = props;

  const value = React.useMemo<ContextState | null>((): ContextState | null => {
    if (physicalSize) return physicalSize;

    const error = new AppError(
      `${CardPhysicalSizeProvider.name} (${logProps.current.debugLocation}) could not determine a size, either none is provided or our store lookup couldn't resolve one`,
      logProps.current,
    );

    switch (nullBehaviour) {
      case "throw":
        throw error;
      case "log":
        error.log("warn");
        return null;
      case "log-and-fallback":
        error.log("warn");
        return defaultCardDimensions;
      case "fallback":
        return defaultCardDimensions;
      case "ignore":
        return null;
    }
  }, [physicalSize, nullBehaviour]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
