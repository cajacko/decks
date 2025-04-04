import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, Sync, SliceName, DateString } from "../types";
import { syncState, setState as pullState } from "../combinedActions/sync";
import { createCard, deleteCard, updateCard } from "../combinedActions/cards";
import { createDeck, deleteDeck } from "../combinedActions/decks";
import { setDeckCardDefaults, setDeckDetails } from "./decks";
import { setUserSetting, setUserFlag } from "./userSettings";

const initialState: Sync.State = {
  lastPulled: null,
  lastPushed: null,
  lastSynced: null,
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncState, (state, action) => {
        state.lastSynced = action.payload.date;
      })
      .addCase(pullState, (state, action) => {
        state.lastPulled = action.payload.date;
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
  props: { key: keyof Sync.State },
): DateString | null => selectSync(state)[props.key];

export default syncSlice;
