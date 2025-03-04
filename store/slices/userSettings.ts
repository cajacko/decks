import { createSlice } from "@reduxjs/toolkit";
import { RootState, UserSettings, SliceName } from "../types";
import { getFlag } from "@/utils/flags";
import devInitialState from "../dev/devInitialState";

export type UserSettingsState = UserSettings.State;

const initialState: UserSettingsState = getFlag(
  "USE_DEV_INITIAL_REDUX_STATE",
  null,
)
  ? devInitialState.userSettings
  : {};

export const userSettingsSlice = createSlice({
  name: SliceName.UserSettings,
  initialState,
  reducers: {},
});

export const selectUserSettings = (state: RootState): UserSettingsState =>
  state[userSettingsSlice.name];

export const selectUserSettingsFlags = (
  state: RootState,
): UserSettings.FlagsState | undefined => state[userSettingsSlice.name].flags;

export const selectUserSettingsFlag = <FlagKey extends UserSettings.FlagKey>(
  state: RootState,
  props: { key: FlagKey },
): UserSettings.FlagValue<FlagKey> | undefined =>
  selectUserSettingsFlags(state)?.[props.key];

export default userSettingsSlice;
