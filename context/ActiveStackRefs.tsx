import React from "react";
import { StackRef } from "@/components/stacks/Stack";

type StackListRefsContext = {
  setRef?: (tabletopId: string, ref: StackRef) => void;
  removeRef?: (tabletopId: string) => void;
  getRef?: (tabletopId: string) => StackRef | undefined;
  refs?: Record<string, StackRef | undefined>;
};

const Context = React.createContext<StackListRefsContext>({});

export function useSetActiveStackRef(
  tabletopId: string,
  stackRef: StackRef | null,
) {
  const { removeRef, setRef } = React.useContext(Context);

  React.useEffect(() => {
    if (stackRef) {
      setRef?.(tabletopId, stackRef);
    } else {
      removeRef?.(tabletopId);
    }

    return () => {
      removeRef?.(tabletopId);
    };
  }, [tabletopId, stackRef, removeRef, setRef]);
}

export function useActiveStackRef(tabletopId: string | null) {
  const refs = React.useContext(Context).refs;

  return tabletopId ? refs?.[tabletopId] : undefined;
}

export function ActiveStackRefsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refs, setRefs] = React.useState<Record<string, StackRef | undefined>>(
    {},
  );

  const value = React.useMemo(
    (): StackListRefsContext => ({
      setRef: (tabletopId, ref) => {
        setRefs((prevRefs) => ({
          ...prevRefs,
          [tabletopId]: ref,
        }));
      },
      removeRef: (tabletopId) => {
        setRefs((prevRefs) => {
          const newRefs = { ...prevRefs };

          delete newRefs[tabletopId];

          return newRefs;
        });
      },
      getRef: (tabletopId) => {
        return refs[tabletopId];
      },
      refs,
    }),
    [refs],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
