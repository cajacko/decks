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
    getFlag("SCREEN_ANIMATIONS") === "disabled" ? "disabled" : value,
  NAVIGATION_STACK_ANIMATIONS: (value, getFlag) =>
    getFlag("SCREEN_ANIMATIONS") === "disabled" ? "disabled" : value,
};

// Final fallback values
export const defaultFlags: UserSettings.FlagMap = {
  USE_DEV_INITIAL_REDUX_STATE: true,
  HOLD_MENU_BEHAVIOUR: "hold",
  CARD_ANIMATIONS: "enabled",
  SKELETON_LOADER: "enabled",
  NAVIGATION_STACK_ANIMATIONS: "slide",
  NAVIGATION_TAB_ANIMATIONS: "shift",
  SCREEN_ANIMATIONS: "disabled",
  // Does not play nicely with reanimated effects. When we navigated to tabletop, then to deck edit
  // and then back to tabletop, the stacks wouldn't show. The reanimated opacity value seems to have
  // reset and wouldn't set back to 1
  SCREENS_FREEZE_ON_BLUR: false,
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
