import {
  createContext,
  useState,
  useRef,
  useContext,
  useEffect,
  useMemo,
} from "react";
import uuid from "@/utils/uuid";

type HoldMenuContext = {
  setIsHoldMenuActive: (id: string, isHoldMenuActive: boolean) => void;
  getIsHoldMenuActive: () => boolean;
  listen: (callback: (isHoldMenuActive: boolean) => void) => () => void;
};

export const Context = createContext<HoldMenuContext>({
  getIsHoldMenuActive: () => false,
  setIsHoldMenuActive: () => undefined,
  listen: () => () => undefined,
});

export function useRegisterHoldMenuState(isHoldMenuActive: boolean) {
  const id = useRef(uuid()).current;

  const { setIsHoldMenuActive } = useContext(Context);

  setIsHoldMenuActive(id, isHoldMenuActive);

  useEffect(
    () => () => {
      setIsHoldMenuActive(id, false);
    },
    []
  );
}

// HEre we only care if any hold menu is active, not which one
export function useIsHoldMenuActive(): boolean {
  const { listen, getIsHoldMenuActive } = useContext(Context);
  const [isHoldMenuActive, setIsHoldMenuActive] = useState(
    getIsHoldMenuActive()
  );

  useEffect(() => {
    return listen(setIsHoldMenuActive);
  }, []);

  return isHoldMenuActive;
}

export function Provider(props: { children: React.ReactNode }) {
  const value = useMemo((): HoldMenuContext => {
    const isHoldMenuActiveById: Record<string, boolean> = {};

    function getIsHoldMenuActive() {
      return Object.values(isHoldMenuActiveById).some(Boolean);
    }

    const listeners: Record<string, (isHoldMenuActive: boolean) => void> = {};

    return {
      getIsHoldMenuActive,
      listen: (callback) => {
        const id = uuid();

        listeners[id] = callback;

        return () => {
          delete listeners[id];
        };
      },
      setIsHoldMenuActive: (id, isHoldMenuActive) => {
        const prevValue = isHoldMenuActiveById[id];

        if (prevValue === isHoldMenuActive) return;

        const prevIsHoldMenuActive = getIsHoldMenuActive();

        isHoldMenuActiveById[id] = isHoldMenuActive;

        const nextIsHoldMenuActive = getIsHoldMenuActive();

        if (prevIsHoldMenuActive !== nextIsHoldMenuActive) {
          Object.values(listeners).forEach((listener) => {
            listener(nextIsHoldMenuActive);
          });
        }
      },
    };
  }, []);

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
