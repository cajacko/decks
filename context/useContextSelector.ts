import {
  useContextSelector,
  createContext,
  Context,
} from "use-context-selector";

export { useContextSelector, createContext };

type Selector<Value, Selected> = (value: Value) => Selected;

export function useRequiredContextSelector<Value, Selected>(
  context: Context<Value>,
  selector: Selector<Value, Selected>,
): NonNullable<Selected> {
  const value = useContextSelector<Value, Selected>(context, selector);

  if (value === null || value === undefined) {
    throw new Error(
      `Selector "${selector.name}" returned null or undefined value within useRequiredContextSelector`,
    );
  }

  return value;
}

export function withUseContextSelector<Value>(initContext: Value) {
  const context = createContext(initContext);

  return {
    useContextSelector: <Selected>(selector: Selector<Value, Selected>) =>
      useContextSelector<Value, Selected>(context, selector),
    useRequiredContextSelector: <Selected>(
      selector: Selector<Value, Selected>,
    ) => useRequiredContextSelector<Value, Selected>(context, selector),
    context,
  };
}
