import AppError from "@/classes/AppError";
import React from "react";
import { AppState } from "react-native";
import logger from "@/utils/logger";

function debugLog(log: string, props?: unknown) {
  if (process.env.EXPO_PUBLIC_DEBUG_AUTO_SAVE !== "true") return;

  const logTitle = `useAutoSave: ${log}`;

  logger.debug(logTitle);

  // eslint-disable-next-line no-console
  console.log(logTitle, props);
}

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

    debugLog("enabled");

    const interval = setInterval(() => {
      const hasChanges = getHasChanges(hasChangesRef);

      if (!hasChanges) {
        debugLog("interval - no changes");

        return;
      }

      try {
        debugLog("interval - has changes - save");
        saveRef.current();
      } catch (unknownError) {
        debugLog("interval - error saving");
        AppError.getError(
          unknownError,
          `${useAutoSave.name}: failed to auto save on interval`,
        ).log("error");
      }
    }, 3000);

    const subscription = AppState.addEventListener("change", () => {
      const hasChanges = getHasChanges(hasChangesRef);

      if (!hasChanges) {
        debugLog("AppState event - no changes");

        return;
      }

      try {
        debugLog("AppState event - has changes - save");

        saveRef.current();
      } catch (unknownError) {
        debugLog("AppState event - error saving");

        AppError.getError(
          unknownError,
          `${useAutoSave.name}: failed to auto save on app state change`,
        ).log("error");
      }
    });

    return () => {
      subscription.remove();

      clearInterval(interval);

      const hasChanges = getHasChanges(hasChangesRef);

      if (!hasChanges) {
        debugLog("unmount - no changes");

        return;
      }

      try {
        debugLog("unmount - has changes - save");
        saveRef.current();
      } catch (unknownError) {
        debugLog("unmount - error saving");
        AppError.getError(
          unknownError,
          `${useAutoSave.name}: failed to auto save on end of effect`,
        ).log("error");
      }
    };
  }, [autoSave]);
}
