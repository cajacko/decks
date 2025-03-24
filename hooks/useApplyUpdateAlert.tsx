import React from "react";
import Alert, { AlertButton } from "@/components/overlays/Alert";
import text from "@/constants/text";
import { useUpdates, reloadAsync } from "expo-updates";

export default function useApplyUpdateAlert() {
  const { isUpdatePending: canApplyUpdate } = useUpdates();

  const [showUpdateModal, setShowUpdateModal] =
    React.useState<boolean>(canApplyUpdate);

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
