import React from "react";
import { createContext, useContextSelector } from "use-context-selector";

export type Notification = {
  text: string;
};

const notificationTimeoutDuration = 2000;

interface NotificationsContext {
  notification: Notification | null;
  clear: () => void;
  extendNotification: () => void;
  notify: (notification: Notification) => void;
}

const Context = createContext<NotificationsContext>({
  notification: null,
  clear: () => {},
  extendNotification: () => {},
  notify: () => {},
});

export function useNotification() {
  return useContextSelector(Context, (context) => context.notification);
}

export function useClearNotification() {
  return useContextSelector(Context, (context) => context.clear);
}

export function useExtendNotification() {
  return useContextSelector(Context, (context) => context.extendNotification);
}

export function useNotify() {
  return useContextSelector(Context, (context) => context.notify);
}

export const NotificationProvider = React.memo(function GlobalLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [notification, setNotification] = React.useState<Notification | null>(
    null,
  );

  const notificationTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const notify = React.useCallback<NotificationsContext["notify"]>(
    ({ text }) => {
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }

      setNotification({ text });

      notificationTimeout.current = setTimeout(() => {
        setNotification(null);
      }, notificationTimeoutDuration);
    },
    [],
  );

  const clear = React.useCallback(() => {
    setNotification(null);

    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
  }, []);

  const extendNotification = React.useCallback(() => {
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }

    notificationTimeout.current = setTimeout(() => {
      setNotification(null);
    }, notificationTimeoutDuration * 2);
  }, []);

  const value = React.useMemo(
    (): NotificationsContext => ({
      notification,
      clear,
      extendNotification,
      notify,
    }),
    [notify, notification, clear, extendNotification],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
});
