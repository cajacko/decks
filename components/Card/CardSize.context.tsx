import AppError from "@/classes/AppError";
import React, { createContext } from "react";
import { CardSizeProps, CardSizeContextProps } from "./Card.types";
import { useOptionalTabletopContext } from "@/components/Tabletop/Tabletop.context";
import {
  getCardSizes,
  defaultCardDimensions,
  getSizesFromWidth,
  defaultCardDpWidth,
} from "./cardSizes";

interface CardSizeContext {
  props: CardSizeContextProps;
  sizes: CardSizeProps;
}

export const Context = createContext<CardSizeContext | undefined>(undefined);

export function useCardSizes({
  constraints,
  proportions,
}: Partial<CardSizeContextProps> = {}): CardSizeProps {
  const { cardSizes: tabletopCardSizeProps } =
    useOptionalTabletopContext() ?? {};

  const cardSizeProps = React.useContext(Context);

  return React.useMemo((): CardSizeProps => {
    if (constraints && proportions) {
      return getCardSizes({ constraints, proportions });
    }

    if (cardSizeProps) {
      if (constraints) {
        return getCardSizes({
          constraints,
          proportions: cardSizeProps.props.proportions,
        });
      }

      if (proportions) {
        return getCardSizes({
          constraints: cardSizeProps.props.constraints,
          proportions,
        });
      }

      return cardSizeProps.sizes;
    }

    if (tabletopCardSizeProps) {
      if (constraints) {
        return getCardSizes({
          constraints,
          proportions: tabletopCardSizeProps,
        });
      }

      if (proportions) {
        return getCardSizes({
          constraints: {
            maxHeight: tabletopCardSizeProps.dpHeight,
            maxWidth: tabletopCardSizeProps.dpWidth,
          },
          proportions,
        });
      }

      return tabletopCardSizeProps;
    }

    new AppError(
      `${useCardSizes.name} must be used within a CardProvider component or passed both constraints & proportions, will be returning default values which are definitely not correct`,
    ).log("error");

    if (constraints) {
      return getCardSizes({ constraints, proportions: defaultCardDimensions });
    }

    if (proportions) {
      return getCardSizes({
        constraints: {
          maxWidth: defaultCardDpWidth,
        },
        proportions,
      });
    }

    return getSizesFromWidth(defaultCardDpWidth, defaultCardDimensions);
  }, [cardSizeProps, constraints, proportions, tabletopCardSizeProps]);
}

export interface CardSizeProviderProps extends CardSizeContextProps {
  children: React.ReactNode | ((context: CardSizeProps) => React.ReactNode);
}

export function useScaleValue(): (value: number) => number {
  const { dpWidth, mmWidth } = useCardSizes();

  return React.useCallback(
    (value: number) => (value / dpWidth) * mmWidth,
    [dpWidth, mmWidth],
  );
}

export function CardSizeProvider({
  children,
  proportions,
  constraints,
}: CardSizeProviderProps) {
  const value = React.useMemo<CardSizeContext>(
    () => ({
      props: { proportions, constraints },
      sizes: getCardSizes({ proportions, constraints }),
    }),
    [proportions, constraints],
  );

  const child = React.useMemo(
    () => (typeof children === "function" ? children(value.sizes) : children),
    [children, value],
  );

  return <Context.Provider value={value}>{child}</Context.Provider>;
}
