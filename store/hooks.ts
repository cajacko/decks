import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

type Selector<T> = (state: RootState) => T;

export const useRequiredAppSelector = <T>(
  selector: Selector<T>,
): NonNullable<T> => {
  const value = useAppSelector(selector);

  if (value === null || value === undefined) {
    throw new Error(
      `Selector "${selector.name}" returned null or undefined value within useRequiredAppSelector`,
    );
  }

  return value as NonNullable<T>;
};
