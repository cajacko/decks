import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// You can safely import the RootState type from the store file here. It's a circular import, but
// the TypeScript compiler can correctly handle that for types. This may be needed for use cases
// like writing selector functions.
// From: https://redux.js.org/tutorials/typescript-quick-start
import type { RootState } from "../store";

export interface UserSettingsState {
  animateCardMovement: boolean;
  holdMenuBehaviour: "hold" | "tap";
}

// Define the initial state using that type
const initialState: UserSettingsState = {
  animateCardMovement: true,
  holdMenuBehaviour: "hold",
};

export const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {},
});

// export const { setCard, setCards, removeCard } = cardsSlice.actions;

export const selectUserSettings = (state: RootState): UserSettingsState =>
  state[userSettingsSlice.name];

export default userSettingsSlice;
