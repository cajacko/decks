import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  redo,
  selectTabletopHasFuture,
  selectTabletopHasPast,
  undo,
  getRedoState,
  getUndoState,
  getState,
  TabletopHistoryState,
} from "@/store/slices/tabletop";
import { store } from "@/store/store";
import { SliceName } from "@/store/types";

export interface UseTabletopHistoryOptions {
  beforeUndo?: (
    state: TabletopHistoryState | null,
    undoState: TabletopHistoryState | null,
  ) => void | (() => void);
  beforeRedo?: (
    state: TabletopHistoryState | null,
    redoState: TabletopHistoryState | null,
  ) => void | (() => void);
}

export default function useTabletopHistory(
  tabletopId: string,
  options?: UseTabletopHistoryOptions,
) {
  const { beforeUndo, beforeRedo } = options || {};

  const dispatch = useAppDispatch();
  const hasPast = useAppSelector((state) =>
    selectTabletopHasPast(state, { tabletopId }),
  );

  const hasFuture = useAppSelector((state) =>
    selectTabletopHasFuture(state, { tabletopId }),
  );

  const handleUndo = React.useCallback(() => {
    const sliceState = store.getState()[SliceName.Tabletops];
    const undoState = getUndoState(sliceState, { tabletopId });
    const currentState = getState(sliceState, { tabletopId });

    const afterUndo = beforeUndo?.(currentState, undoState);

    dispatch(undo({ tabletopId }));

    afterUndo?.();
  }, [dispatch, tabletopId, beforeUndo]);

  const handleRedo = React.useCallback(() => {
    const sliceState = store.getState()[SliceName.Tabletops];
    const redoState = getRedoState(sliceState, { tabletopId });
    const currentState = getState(sliceState, { tabletopId });

    const afterRedo = beforeRedo?.(currentState, redoState);

    dispatch(redo({ tabletopId }));

    afterRedo?.();
  }, [dispatch, tabletopId, beforeRedo]);

  return {
    hasPast,
    hasFuture,
    undo: hasPast ? handleUndo : undefined,
    redo: hasFuture ? handleRedo : undefined,
  };
}
