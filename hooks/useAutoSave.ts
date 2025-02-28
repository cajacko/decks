import AppError from "@/classes/AppError";
import React from "react";
import { AppState } from "react-native";

interface UseAutoSaveProps {
  autoSave?: boolean;
  save: () => void;
  hasChanges: boolean | (() => boolean);
}

function getHasChanges(
  ref: React.MutableRefObject<boolean | (() => boolean)>,
): boolean {
  return typeof ref.current === "function" ? ref.current() : ref.current;
}

export default function useAutoSave(props: UseAutoSaveProps) {
  const { autoSave = true, save: saveProp, hasChanges: hasChangesProp } = props;

  // Our autosave logic doesn't trigger on value changes, so if the caller of this hook is changing
  // save on each value change our logic stops working, so we keep it in a ref and call the latest
  // when it's time
  const saveRef = React.useRef(saveProp);
  saveRef.current = saveProp;

  const hasChangesRef = React.useRef(hasChangesProp);
  hasChangesRef.current = hasChangesProp;

  React.useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      const hasChanges = getHasChanges(hasChangesRef);

      if (!hasChanges) {
        return;
      }

      try {
        saveRef.current();
      } catch (unknownError) {
        AppError.getError(
          unknownError,
          `${useAutoSave.name}: failed to auto save on interval`,
        ).log("warn");
      }
    }, 3000);

    return () => {
      clearInterval(interval);

      const hasChanges = getHasChanges(hasChangesRef);

      if (!hasChanges) {
        return;
      }

      try {
        saveRef.current();
      } catch (unknownError) {
        AppError.getError(
          unknownError,
          `${useAutoSave.name}: failed to auto save on end of effect`,
        ).log("error");
      }
    };
  }, [autoSave]);

  React.useEffect(() => {
    if (!autoSave) return;

    const subscription = AppState.addEventListener("change", () => {
      const hasChanges = getHasChanges(hasChangesRef);

      if (!hasChanges) {
        return;
      }

      try {
        saveRef.current();
      } catch (unknownError) {
        AppError.getError(
          unknownError,
          `${useAutoSave.name}: failed to auto save on app state change`,
        ).log("error");
      }
    });

    return () => {
      subscription.remove();
    };
  }, [autoSave]);
}
