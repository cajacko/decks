import React from "react";

interface ContextState {
  mmToDp: (mm: number) => number;
  mmDistance: number;
  dpDistance: number;
}

const Context = React.createContext<ContextState | null>(null);

export function usePhysicalMeasures() {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error(
      "usePhysicalMeasures must be used within a PhysicalMeasuresProvider component",
    );
  }

  return context;
}

interface PhysicalMeasuresProviderProps {
  children: React.ReactNode;
  mmDistance: number;
  dpDistance: number;
}

export function PhysicalMeasuresProvider({
  children,
  dpDistance,
  mmDistance,
}: PhysicalMeasuresProviderProps) {
  const mmToDp = React.useCallback(
    (mm: number): number => (mm / mmDistance) * dpDistance,
    [dpDistance, mmDistance],
  );

  const value = React.useMemo<ContextState>(
    () => ({ mmToDp, dpDistance, mmDistance }),
    [mmToDp, dpDistance, mmDistance],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
