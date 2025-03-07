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
  reducers: {
    setUserFlag: <FlagKey extends UserSettings.FlagKey>(
      state: UserSettingsState,
      action: {
        type: string;
        payload: {
          key: FlagKey;
          value: UserSettings.FlagValue<FlagKey> | null;
        };
      },
    ) => {
      state.flags = state.flags || {};

      if (action.payload.value === null) {
        delete state.flags[action.payload.key];

        return;
      }

      // @ts-ignore
      state.flags[action.payload.key] = action.payload.value;
    },
    setUserSetting: <K extends UserSettings.UserSettingKey>(
      state: UserSettingsState,
      action: {
        type: string;
        payload: {
          key: K;
          value: UserSettings.UserSettingValue<K> | null;
        };
      },
    ) => {
      if (action.payload.value === null) {
        delete state[action.payload.key];

        return;
      }

      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { setUserFlag, setUserSetting } = userSettingsSlice.actions;

export const selectUserSettings = (state: RootState): UserSettingsState =>
  state[userSettingsSlice.name];

export const selectUserSetting = <K extends UserSettings.UserSettingKey>(
  state: RootState,
  props: { key: K },
): UserSettings.UserSettingValue<K> => selectUserSettings(state)[props.key];

export const selectUserSettingsFlags = (
  state: RootState,
): UserSettings.FlagsState | undefined => state[userSettingsSlice.name].flags;

export const selectUserSettingsFlag = <FlagKey extends UserSettings.FlagKey>(
  state: RootState,
  props: { key: FlagKey },
): UserSettings.FlagValue<FlagKey> | undefined =>
  selectUserSettingsFlags(state)?.[props.key];

export default userSettingsSlice;
