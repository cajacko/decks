/**
 * Flags can be set by:
 * - devOverrides (hard coded) - If the flag key exists here it overrides anything else
 * - userSettings (redux) - If the flag key exists in userSettings, it overrides the default
 * - default (hard coded) - If the flag key does not exist in userSettings, it falls back to the
 *   default
 */

import { UserSettings } from "@/store/types";

export const defaultFlags: UserSettings.FlagMap = {
  USE_DEV_INITIAL_REDUX_STATE: true,
  HOLD_MENU_BEHAVIOUR: "hold",
  CARD_ANIMATIONS: "enabled",
};

export const flagOverrides: Partial<UserSettings.FlagMap> = {};
