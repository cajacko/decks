import React from "react";

export interface CardSizeConstraints {
  height?: number;
  width?: number;
  maxHeight?: number;
  maxWidth?: number;
}

export interface CardConstraintsProviderProps extends CardSizeConstraints {
  children: React.ReactNode;
}

type ContextState = CardSizeConstraints;

const Context = React.createContext<ContextState>({});

export function useCardSizeConstraints(
  constraints?: CardSizeConstraints,
): CardSizeConstraints {
  const context = React.useContext(Context);

  if (constraints) return constraints;

  return context;
}

export function CardConstraintsProvider({
  children,
  height,
  maxHeight,
  maxWidth,
  width,
}: CardConstraintsProviderProps) {
  const value = React.useMemo<ContextState>(
    (): ContextState => ({
      height,
      maxHeight,
      maxWidth,
      width,
    }),
    [height, maxHeight, maxWidth, width],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
