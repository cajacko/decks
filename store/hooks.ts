import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import AppError from "@/classes/AppError";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

type Selector<T> = (state: RootState) => T;

export const useRequiredAppSelector = <T>(
  selector: Selector<T>,
  selectorName: string,
): NonNullable<T> => {
  const value = useAppSelector(selector);

  if (value === null || value === undefined) {
    throw new AppError(
      `Selector "${selectorName ?? selector.name}" returned null or undefined value within ${useRequiredAppSelector.name}`,
    );
  }

  return value as NonNullable<T>;
};

export function useHasRehydrated() {
  return useAppSelector((state) => state._persist.rehydrated);
}
