import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// You can safely import the RootState type from the store file here. It's a circular import, but
// the TypeScript compiler can correctly handle that for types. This may be needed for use cases
// like writing selector functions.
// From: https://redux.js.org/tutorials/typescript-quick-start
import type { RootState } from "../store";

export interface Tabletop {
  id: string;
  stacksIds: string[];
  availableDecks: string[];
  /**
   * Cards that are not part of the availableDecks but should still be available to the tabletop
   */
  // additionalAvailableCards: string[];
  /**
   * A hand has a stack structure but is not part of the tabletop stacks
   */
  // handStackId: string | null;
  // defines how the tabletop is set up on load or reset, it may just follow the deck setup, or be
  // custom?
  // initSetup: {}
}

export interface TabletopState {
  tabletopsById: Record<string, Tabletop | undefined>;
}

// Define the initial state using that type
const initialState: TabletopState = {
  tabletopsById: {
    tabletop1: {
      id: "tabletop1",
      stacksIds: ["stack1", "stack2"],
      availableDecks: ["deck1"],
      // additionalAvailableCards: [],
      // handStackId: "hand1",
    },
  },
};

export const tabletopsSlice = createSlice({
  name: "tabletops",
  initialState,
  reducers: {
    // resetTabletop
    // createTabletop
    // removeTabletop
    // addStackToTabletop
    // removeStackToTabletop
    // addDeckToTabletop
    // removeDeckToTabletop
  },
});

// export const { setCard, setTabletop } = tabletopsSlice.actions;

export const selectTabletop = (
  state: RootState,
  props: { tabletopId: string }
): Tabletop | null =>
  state[tabletopsSlice.name].tabletopsById[props.tabletopId] ?? null;

export const selectStackIds = (
  state: RootState,
  props: { tabletopId: string }
): string[] | null => selectTabletop(state, props)?.stacksIds ?? null;

export default tabletopsSlice;
