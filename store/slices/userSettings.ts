import { createSlice } from "@reduxjs/toolkit";
import { RootState, UserSettings, SliceName, DateString } from "../types";
import { setState } from "../combinedActions/sync";
import { dateToDateString } from "@/utils/dates";

export type UserSettingsState = UserSettings.State;

const initialState: UserSettingsState = {
  settings: {
    dateCreated: dateToDateString(new Date()),
    dateUpdated: dateToDateString(new Date()),
  },
};

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
          date: DateString;
        };
      },
    ) => {
      state.settings.flags = state.settings.flags || {};
      state.settings.dateUpdated = action.payload.date;

      if (action.payload.value === null) {
        delete state.settings.flags[action.payload.key];

        return;
      }

      // @ts-ignore
      state.settings.flags[action.payload.key] = action.payload.value;
    },
    setUserSetting: <K extends UserSettings.UserSettingKey>(
      state: UserSettingsState,
      action: {
        type: string;
        payload: {
          key: K;
          value: UserSettings.UserSettingValue<K> | null;
          date: DateString;
        };
      },
    ) => {
      state.settings.dateUpdated = action.payload.date;

      if (action.payload.value === null) {
        delete state.settings?.[action.payload.key];

        return;
      }

      state.settings[action.payload.key] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setState, (state, actions) => {
      state.settings = actions.payload.state[SliceName.UserSettings].settings;
    });
  },
});

export const { setUserFlag, setUserSetting } = userSettingsSlice.actions;

export const selectUserSettings = (state: RootState): UserSettingsState =>
  state[userSettingsSlice.name];

export const selectUserSetting = <K extends UserSettings.UserSettingKey>(
  state: RootState,
  props: { key: K },
): UserSettings.UserSettingValue<K> | undefined =>
  selectUserSettings(state).settings?.[props.key];

export const selectUserSettingsFlags = (
  state: RootState,
): UserSettings.FlagsState | undefined =>
  state[userSettingsSlice.name].settings?.flags;

export const selectUserSettingsFlag = <FlagKey extends UserSettings.FlagKey>(
  state: RootState,
  props: { key: FlagKey },
): UserSettings.FlagValue<FlagKey> | undefined =>
  selectUserSettingsFlags(state)?.[props.key];

export default userSettingsSlice;
