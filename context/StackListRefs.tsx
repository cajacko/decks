import React from "react";
import { StackListRef } from "@/components/stacks/StackList";

type StackListRefsContext = {
  setRef?: (tabletopId: string, ref: React.RefObject<StackListRef>) => void;
  removeRef?: (tabletopId: string) => void;
  getRef?: (tabletopId: string) => React.RefObject<StackListRef> | undefined;
};

const Context = React.createContext<StackListRefsContext>({});

export function useSetStackListRef(
  tabletopId: string,
  stackListRef: React.RefObject<StackListRef>,
) {
  const { removeRef, setRef } = React.useContext(Context);

  React.useEffect(() => {
    setRef?.(tabletopId, stackListRef);

    return () => {
      removeRef?.(tabletopId);
    };
  }, [tabletopId, stackListRef, removeRef, setRef]);
}

export function useGetStackListRef(tabletopId: string | null) {
  const { getRef } = React.useContext(Context);

  return React.useMemo(
    () => () => (tabletopId ? getRef?.(tabletopId) : undefined),
    [getRef, tabletopId],
  );
}

export function StackListRefsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const refs = React.useRef<
    Record<string, React.RefObject<StackListRef> | undefined>
  >({});

  const value = React.useMemo(
    (): StackListRefsContext => ({
      setRef: (tabletopId, ref) => {
        refs.current[tabletopId] = ref;
      },
      removeRef: (tabletopId) => {
        delete refs.current[tabletopId];
      },
      getRef: (tabletopId) => refs.current[tabletopId],
    }),
    [],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
