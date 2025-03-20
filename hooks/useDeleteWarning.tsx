import React from "react";
import Alert, { AlertButton } from "@/components/Alert";
import text from "@/constants/text";
import useVibrate from "./useVibrate";

export interface UseDeleteWarningProps {
  handleDelete: () => void;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  deleteButtonText?: string;
  vibrate?: boolean;
}

export default function useDeleteWarning({
  handleDelete,
  buttons,
  message,
  title,
  deleteButtonText,
  vibrate: shouldVibrate = true,
}: UseDeleteWarningProps) {
  const { vibrate } = useVibrate();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const open = React.useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const close = React.useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const deleteButtons = React.useMemo<AlertButton[]>(
    () => [
      { text: text["general.cancel"], onPress: close, style: "cancel" },
      {
        text: deleteButtonText ?? text["general.delete"],
        onPress: () => {
          if (shouldVibrate) {
            vibrate?.(title ?? text["general.delete"]);
          }
          handleDelete();
          close();
        },
        style: "destructive",
      },
    ],
    [close, handleDelete, deleteButtonText, vibrate, shouldVibrate, title],
  );

  return {
    open,
    close,
    visible: showDeleteConfirm,
    component: (
      <Alert
        visible={showDeleteConfirm}
        onRequestClose={close}
        title={title ?? text["general.delete"]}
        message={message ?? text["delete_warning.message.default"]}
        buttons={buttons ?? deleteButtons}
      />
    ),
  };
}
