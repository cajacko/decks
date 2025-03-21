/**
 * Flags can be set by:
 * - devOverrides (hard coded) - If the flag key exists here it overrides anything else
 * - userSettings (redux) - If the flag key exists in userSettings, it overrides the default
 * - default (hard coded) - If the flag key does not exist in userSettings, it falls back to the
 *   default
 */

import { UserSettings } from "@/store/types";
import { Platform } from "react-native";
import * as DevClient from "expo-dev-client";

// If set, this value will be used
export const flagOverrides: Partial<UserSettings.FlagMap> = {};

// If some flags depend on others, define that relationship here so it's all in one place. Beware of
// circular dependencies though
export const flagRelationships: FlagRelationships = {
  CARD_ACTIONS_HAPTICS: (value, getFlag) =>
    getFlag("PERFORMANCE_MODE") === "enabled" ? "disabled" : value,
  STACK_LIST_ITEM_BEHAVIOUR: (value, getFlag) =>
    getFlag("PERFORMANCE_MODE") === "enabled" ? "top-touchable" : value,
  BOTTOM_DRAWER_ANIMATE: (value, getFlag) =>
    getFlag("PERFORMANCE_MODE") === "enabled" ? "disabled" : value,
  BOTTOM_DRAWER_DRAG: (value, getFlag) =>
    getFlag("PERFORMANCE_MODE") === "enabled" ? "disabled" : value,
  HOLD_MENU_BEHAVIOUR: (value, getFlag) =>
    getFlag("PERFORMANCE_MODE") === "enabled" ||
    getFlag("CARD_ACTIONS_ALWAYS_VISIBLE") === true
      ? "always-visible"
      : value,
  CARD_ACTIONS_ALWAYS_VISIBLE: (value, getFlag) =>
    getFlag("PERFORMANCE_MODE") === "enabled" ? true : value,
  CARD_ANIMATIONS: (value, getFlag) =>
    getFlag("PERFORMANCE_MODE") === "enabled" ? "disabled" : value,
  GENERAL_LAYOUT_ANIMATIONS: (value, getFlag) =>
    getFlag("PERFORMANCE_MODE") === "enabled" ? "disabled" : value,
  SKELETON_LOADER: (value, getFlag) =>
    getFlag("PERFORMANCE_MODE") === "enabled" ? "enabled" : value,
  NAVIGATION_STACK_ANIMATIONS: (value, getFlag) =>
    getFlag("SCREEN_ANIMATIONS") === "react-navigation" ? value : "disabled",
  SCREEN_ANIMATIONS: (value, getValue) => {
    if (getValue("PERFORMANCE_MODE") === "enabled") {
      return "disabled";
    }

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
  DEV_MODE:
    process.env.NODE_ENV === "development" || DevClient.isDevelopmentBuild()
      ? true
      : false,
  CARD_ANIMATE_OUT_BEHAVIOUR: Platform.OS === "web" ? "linear" : "bezier",
  CARD_ACTIONS_HAPTICS: Platform.OS === "web" ? "disabled" : "enabled",
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
