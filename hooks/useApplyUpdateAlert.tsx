import React from "react";
import Alert, { AlertButton } from "@/components/overlays/Alert";
import text from "@/constants/text";
import {
  useUpdates,
  reloadAsync,
  checkForUpdateAsync,
  fetchUpdateAsync,
} from "expo-updates";
import { AppState } from "react-native";

const maxUpdateCheckInterval = 1000 * 60 * 60; // 1 hour

export default function useApplyUpdateAlert({
  autoCheck = false,
}: {
  autoCheck?: boolean;
} = {}) {
  const {
    isUpdatePending,
    lastCheckForUpdateTimeSinceRestart,
    downloadedUpdate,
  } = useUpdates();

  // NOTE: Sometimes we get isUpdatePending=true but downloadedUpdate=undefined. A bug in
  // expo-updates? This check should catch that
  const canApplyUpdate = !!isUpdatePending && !!downloadedUpdate;

  const lastCheckedForUpdate = React.useRef<Date | undefined>(
    lastCheckForUpdateTimeSinceRestart,
  );

  const [showUpdateModal, setShowUpdateModal] = React.useState<boolean>(
    autoCheck ? canApplyUpdate : false,
  );

  React.useEffect(() => {
    if (!autoCheck) return;
    // Does not work in expo go, so don't do in development
    if (process.env.NODE_ENV === "development") return;

    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;

      if (lastCheckedForUpdate.current) {
        const timeSinceLastCheck =
          new Date().getTime() - lastCheckedForUpdate.current.getTime();

        if (timeSinceLastCheck < maxUpdateCheckInterval) return;
      }

      lastCheckedForUpdate.current = new Date();

      checkForUpdateAsync().then((update) => {
        if (update) {
          fetchUpdateAsync();
        }
      });
    });

    return () => {
      subscription.remove();
    };
  }, [autoCheck]);

  React.useEffect(() => {
    if (canApplyUpdate) {
      setShowUpdateModal(canApplyUpdate);
    }
  }, [canApplyUpdate]);

  const open = React.useCallback(() => {
    setShowUpdateModal(true);
  }, []);

  const close = React.useCallback(() => {
    setShowUpdateModal(false);
  }, []);

  const title = text["update_alert.title"];
  const message = text["update_alert.message"];
  const buttonText = text["update_alert.button"];

  const buttons = React.useMemo<AlertButton[]>(
    () => [
      { text: text["general.cancel"], onPress: close, style: "cancel" },
      {
        text: buttonText,
        onPress: () => {
          reloadAsync();
          close();
        },
        style: "default",
      },
    ],
    [close, buttonText],
  );

  return {
    canApplyUpdate,
    title,
    message,
    buttonText,
    reload: reloadAsync,
    open,
    close,
    visible: showUpdateModal,
    component: (
      <Alert
        visible={showUpdateModal}
        onRequestClose={close}
        title={title}
        message={message}
        buttons={buttons}
      />
    ),
  };
}
