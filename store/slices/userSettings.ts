import { createSlice } from "@reduxjs/toolkit";
import { RootState, UserSettingsState } from "../types";

export type { UserSettingsState };

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
