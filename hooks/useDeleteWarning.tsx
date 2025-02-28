import React from "react";
import Alert, { AlertButton } from "@/components/Alert";

export interface UseDeleteWarningProps {
  handleDelete: () => void;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
}

export default function useDeleteWarning({
  handleDelete,
  buttons,
  message,
  title,
}: UseDeleteWarningProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const open = React.useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const close = React.useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const deleteButtons = React.useMemo<AlertButton[]>(
    () => [
      { text: "Cancel", onPress: close, style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          handleDelete();
          close();
        },
        style: "destructive",
      },
    ],
    [close, handleDelete],
  );

  return {
    open,
    close,
    visible: showDeleteConfirm,
    component: (
      <Alert
        visible={showDeleteConfirm}
        onRequestClose={close}
        title={title ?? "Delete"}
        message={message ?? "Are you sure you want to delete this item?"}
        buttons={buttons ?? deleteButtons}
      />
    ),
  };
}
