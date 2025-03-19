import React from "react";

type TargetType = "new-card-in-deck" | "card" | "deck-defaults";

export type Target<T extends TargetType = TargetType> = {
  id: string;
  type: T;
};

export function getIsDeckId(id: Target): id is Target<"new-card-in-deck"> {
  return id.type === "new-card-in-deck";
}

export function getIsCardId(id: Target): id is Target<"card"> {
  return id.type === "card";
}

export function getIsSameTarget(a: Target | null, b: Target | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;

  if (a.id !== b.id) return false;

  return a.type === b.type;
}

export interface CardTargetProviderProps {
  target: Target | null;
  children: React.ReactNode;
  inheritIfSame?: boolean;
}

type ContextState = {
  target: Target | null;
  // changeTarget: (target: Target | null) => void;
};

const Context = React.createContext<ContextState>({
  target: null,
  // changeTarget: () => undefined,
});

export function useDeckIdTarget(deckId: string): Target {
  return React.useMemo(() => ({ id: deckId, type: "deck-defaults" }), [deckId]);
}

export function useCardTarget(
  props: { target?: Target | null } = {},
): Target | null {
  const context = React.useContext(Context);

  if (props.target === undefined) return context.target;

  return props.target;
}

export function withCardTargetProvider<P extends { target: Target }>(
  Component: React.ComponentType<P>,
) {
  return function WithCardTargetProvider(props: P): React.ReactNode {
    return (
      <CardTargetProvider target={props.target} inheritIfSame>
        <Component {...props} />
      </CardTargetProvider>
    );
  };
}

export function CardTargetProvider({
  children,
  target,
  inheritIfSame,
  // onChangeTarget,
}: CardTargetProviderProps) {
  const parentTarget = useCardTarget();

  const value = React.useMemo<ContextState>(
    (): ContextState => ({
      target,
    }),
    [target],
  );

  if (inheritIfSame && getIsSameTarget(parentTarget, target)) {
    return children;
  }

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
