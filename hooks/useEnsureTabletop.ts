import React from "react";
import {
  useAppSelector,
  useBuiltInStateSelector,
  useAppDispatch,
} from "@/store/hooks";
import { setTabletop } from "@/store/slices/tabletop";
import { selectTabletop } from "@/store/selectors/tabletops";

export default function useEnsureTabletop(props: { tabletopId: string }): {
  hasTabletop: boolean;
} {
  const dispatch = useAppDispatch();
  const hasTabletop = useAppSelector((state) => !!selectTabletop(state, props));

  const builtInTabletop = useBuiltInStateSelector((state) =>
    selectTabletop(state, props),
  );

  React.useEffect(() => {
    if (hasTabletop) return;
    // Probably a 404
    if (!builtInTabletop) return;

    dispatch(
      setTabletop({
        tabletopId: props.tabletopId,
        tabletop: builtInTabletop,
      }),
    );
  }, [hasTabletop, builtInTabletop, dispatch, props.tabletopId]);

  return {
    hasTabletop,
  };
}
