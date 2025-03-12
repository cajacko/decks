/**
 * Flags can be set by:
 * - devOverrides (hard coded) - If the flag key exists here it overrides anything else
 * - userSettings (redux) - If the flag key exists in userSettings, it overrides the default
 * - default (hard coded) - If the flag key does not exist in userSettings, it falls back to the
 *   default
 */

import { UserSettings } from "@/store/types";

// If set, this value will be used
export const flagOverrides: Partial<UserSettings.FlagMap> = {};

// If some flags depend on others, define that relationship here so it's all in one place. Beware of
// circular dependencies though
export const flagRelationships: FlagRelationships = {
  NAVIGATION_TAB_ANIMATIONS: (value, getFlag) =>
    getFlag("SCREEN_ANIMATIONS") === "react-navigation" ? value : "disabled",
  NAVIGATION_STACK_ANIMATIONS: (value, getFlag) =>
    getFlag("SCREEN_ANIMATIONS") === "react-navigation" ? value : "disabled",
  SCREEN_ANIMATIONS: (value, getValue) => {
    switch (value) {
      case "custom-fade-in-content":
      case "custom-fade-out-top-background": {
        return getValue("GENERAL_LAYOUT_ANIMATIONS") === "enabled"
          ? value
          : "disabled";
      }
      default:
        return value;
    }
  },
};

// The default value is the first defined option
export const defaultFlags: UserSettings.FlagMap = {
  ...Object.entries(UserSettings.flagMap).reduce(
    (acc, [key, [defaultValue]]) => ({
      ...acc,
      [key]: defaultValue,
    }),
    {} as UserSettings.FlagMap,
  ),
  DEV_MODE: process.env.NODE_ENV === "development" ? true : false,
};

export type GetFlag = <FlagKey extends UserSettings.FlagKey>(
  key: FlagKey,
) => UserSettings.FlagValue<FlagKey>;

type FlagRelationships = {
  [FlagKey in UserSettings.FlagKey]?: (
    value: UserSettings.FlagValue<FlagKey>,
    getFlag: GetFlag,
  ) => UserSettings.FlagValue<FlagKey>;
};
