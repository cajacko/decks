import { createSlice } from "@reduxjs/toolkit";
import { RootState, UserSettings, SliceName } from "../types";
import flags from "@/constants/flags";
import devInitialState from "../dev/devInitialState";

export type UserSettingsState = UserSettings.State;

const initialState: UserSettingsState = flags.USE_DEV_INITIAL_REDUX_STATE
  ? devInitialState.userSettings
  : {
      animateCardMovement: true,
      holdMenuBehaviour: "hold",
    };

export const userSettingsSlice = createSlice({
  name: SliceName.UserSettings,
  initialState,
  reducers: {},
});

export const selectUserSettings = (state: RootState): UserSettingsState =>
  state[userSettingsSlice.name];

export default userSettingsSlice;
