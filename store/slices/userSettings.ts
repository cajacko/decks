import { createSlice } from "@reduxjs/toolkit";
import { RootState, UserSettings, SliceName, DateString } from "../types";
import { setState, syncState } from "../combinedActions/sync";
import { getMostRecentItem } from "../utils/mergeData";

export type UserSettingsState = UserSettings.State;

const initialState: UserSettingsState = {
  settings: null,
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
      const settings = state.settings ?? {
        dateCreated: action.payload.date,
        dateUpdated: action.payload.date,
      };

      const flags = settings.flags ?? {};

      settings.dateUpdated = action.payload.date;

      if (action.payload.value === null) {
        delete flags[action.payload.key];
      } else {
        // @ts-ignore
        flags[action.payload.key] = action.payload.value;
      }

      settings.flags = flags;
      state.settings = settings;
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
      const settings = state.settings ?? {
        dateCreated: action.payload.date,
        dateUpdated: action.payload.date,
      };

      settings.dateUpdated = action.payload.date;

      if (action.payload.value === null) {
        delete settings?.[action.payload.key];
      } else {
        settings[action.payload.key] = action.payload.value;
      }

      state.settings = settings;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setState, (state, actions) => {
      state.settings = actions.payload.state[SliceName.UserSettings].settings;
    });

    builder.addCase(syncState, (state, actions) => {
      const inboundState =
        actions.payload.state[SliceName.UserSettings].settings;

      if (!state.settings) {
        state.settings = inboundState;
      } else if (inboundState) {
        const mostRecent = getMostRecentItem({
          existing: state.settings,
          incoming: inboundState,
        });

        if (mostRecent === inboundState) {
          state.settings = inboundState;
        }
      }
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
