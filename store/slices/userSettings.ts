import { createSlice } from "@reduxjs/toolkit";
import { RootState, UserSettingsState } from "../types";
import flags from "@/config/flags";
import devInitialState from "../dev/devInitialState";

export type { UserSettingsState };

const initialState: UserSettingsState = flags.USE_DEV_INITIAL_REDUX_STATE
  ? devInitialState.userSettings
  : {
      animateCardMovement: true,
      holdMenuBehaviour: "hold",
    };

export const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {},
});

export const selectUserSettings = (state: RootState): UserSettingsState =>
  state[userSettingsSlice.name];

export default userSettingsSlice;
