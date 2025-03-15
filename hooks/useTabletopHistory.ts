import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  redo,
  selectTabletopHasFuture,
  selectTabletopHasPast,
  undo,
} from "@/store/slices/tabletop";

export default function useTabletopHistory(tabletopId: string) {
  const dispatch = useAppDispatch();
  const hasPast = useAppSelector((state) =>
    selectTabletopHasPast(state, { tabletopId }),
  );
  const hasFuture = useAppSelector((state) =>
    selectTabletopHasFuture(state, { tabletopId }),
  );

  const handleUndo = React.useCallback(() => {
    dispatch(undo({ tabletopId }));
  }, [dispatch, tabletopId]);

  const handleRedo = React.useCallback(() => {
    dispatch(redo({ tabletopId }));
  }, [dispatch, tabletopId]);

  return {
    hasPast,
    hasFuture,
    undo: hasPast ? handleUndo : undefined,
    redo: hasFuture ? handleRedo : undefined,
  };
}
