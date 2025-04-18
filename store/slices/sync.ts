import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, Sync, SliceName, DateString } from "../types";
import {
  syncState,
  setState as pullState,
  removeDeletedContent,
} from "../combinedActions/sync";
import { createCard, deleteCard, updateCard } from "../combinedActions/cards";
import { createDeck, deleteDeck } from "../combinedActions/decks";
import { setDeckCardDefaults, setDeckDetails } from "./decks";
import { setUserSetting, setUserFlag } from "./userSettings";

const initialState: Sync.State = {
  lastSyncSize: null,
  lastPulled: null,
  lastPushed: null,
  lastSynced: null,
  lastRemovedDeletedContent: null,
  lastModifiedImportantChangesLocally: null,
};

export const syncSlice = createSlice({
  name: SliceName.Sync,
  initialState,
  reducers: {
    setState: (state, actions: PayloadAction<Partial<Sync.State>>) => {
      if (actions.payload.lastPulled !== undefined) {
        state.lastPulled = actions.payload.lastPulled;
      }

      if (actions.payload.lastPushed !== undefined) {
        state.lastPushed = actions.payload.lastPushed;
      }

      if (actions.payload.lastSynced !== undefined) {
        state.lastSynced = actions.payload.lastSynced;
      }

      if (actions.payload.lastRemovedDeletedContent !== undefined) {
        state.lastRemovedDeletedContent =
          actions.payload.lastRemovedDeletedContent;
      }

      if (actions.payload.lastModifiedImportantChangesLocally !== undefined) {
        state.lastModifiedImportantChangesLocally =
          actions.payload.lastModifiedImportantChangesLocally;
      }

      if (actions.payload.lastSyncSize !== undefined) {
        state.lastSyncSize = actions.payload.lastSyncSize;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncState, (state, action) => {
        state.lastSyncSize = action.payload.lastSyncSize;
        state.lastSynced = action.payload.date;
      })
      .addCase(pullState, (state, action) => {
        state.lastSyncSize = action.payload.lastSyncSize;
        state.lastPulled = action.payload.date;
      })
      .addCase(removeDeletedContent, (state, action) => {
        state.lastRemovedDeletedContent = action.payload.date;
      });

    [
      createCard,
      deleteCard,
      updateCard,
      createDeck,
      deleteDeck,
      setDeckCardDefaults,
      setDeckDetails,
      setUserSetting,
      setUserFlag,
    ].forEach((action) => {
      builder.addCase(action, (state, action) => {
        state.lastModifiedImportantChangesLocally = action.payload.date;
      });
    });
  },
});

export const { setState } = syncSlice.actions;

export const selectSync = (state: RootState): Sync.State =>
  state[SliceName.Sync];

export const selectSyncDate = (
  state: RootState,
  props: { key: Exclude<keyof Sync.State, "lastSyncSize"> },
): DateString | null => selectSync(state)[props.key] ?? null;

export default syncSlice;
