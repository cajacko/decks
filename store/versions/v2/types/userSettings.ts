// NOTE: This is in redux, so any breaking changes needs a new version, additive changes are fine
// Avoid booleans, unless it's a feature toggle, prefer strings. Otherwise if we change a feature
// from boolean to having some different states we may miss some conditional checks that were just
// doing a truthy check.

import { TimestampMetadata } from "./types";

// NOTE: First option is the default
export const flagMap = {
  // User control flags go here
  PERFORMANCE_MODE: ["disabled", "enabled"],
  HOLD_MENU_BEHAVIOUR: ["hold/hover", "always-visible"],
  CARD_ACTIONS_HAPTICS: ["enabled", "disabled"],
  SHAKE_TO_SHUFFLE: ["disabled", "enabled"],

  // Dev flags
  GLOBAL_NEAT_STACK_BEHAVIOUR: ["force-neat", "user-choice"],
  /**
   * This causes issues when we navigate. HAving any animations running when the nav transitions
   * packs everything up.
   */
  TOOLBAR_LOADING_ANIMATION: ["disabled", "enabled"],
  BACKUP_SYNC: ["disabled", "enabled"],
  AUTO_SYNC: ["enabled", "disabled"],
  ROTATE_CARDS_BEFORE_FLIP: ["disabled", "enabled"],
  SHUFFLE_ANIMATION: ["enabled", "disabled"],
  STACK_LIST_ITEM_BEHAVIOUR: ["all-touchable", "top-touchable"],
  CARD_ANIMATE_SEND_TO_BACK: ["enabled", "disabled"],
  CARD_ANIMATE_OUT_BEHAVIOUR: ["linear", "bezier"],
  HOLD_MENU_DEV_INDICATOR: ["disabled", "enabled"],
  BOTTOM_DRAWER_ANIMATE: ["enabled", "disabled"],
  BOTTOM_DRAWER_DRAG: ["enabled", "disabled"],
  CARD_ACTIONS_ALWAYS_VISIBLE: [false, true],
  EDIT_CARD_MORE_INFO: ["disabled", "enabled"],
  CARD_ANIMATIONS: ["enabled", "disabled"],
  /**
   * Disabled is actually the worst option here as the screens freeze until the entire content has
   * loaded.
   */
  SKELETON_LOADER: ["show-nothing", "enabled", "disabled"],
  /**
   * This can be a big performance hog if enabled, something about having a tone of animated
   * components rendering of screen causing navigation transitions to seize up. Potentially waiting
   * to enable them might help. But it does seem to block the next navigation transition after that.
   */
  SKELETON_ANIMATIONS: ["disabled", "enabled"],
  SCREEN_ANIMATIONS: ["disabled", "react-navigation"],
  NAVIGATION_STACK_ANIMATIONS: ["disabled", "slide"],
  // Does not play nicely with reanimated effects. When we navigated to tabletop, then to deck edit
  // and then back to tabletop, the stacks wouldn't show. The reanimated opacity value seems to have
  // reset and wouldn't set back to 1
  SCREENS_FREEZE_ON_BLUR: [false, true],
  GENERAL_LAYOUT_ANIMATIONS: ["enabled", "disabled"],
  DEV_MODE: [false, true],
  PURGE_STORE_ON_START: [false, true],

  // Debug logs
  DEBUG_PERFORMANCE: [false, true],
  DEBUG_BOTTOM_DRAWER: [false, true],
  DEBUG_AUTO_SAVE: [false, true],
  DEBUG_EDIT_CARD: [false, true],
  DEBUG_RESOLVE_CARD_DATA: [false, true],
  DEBUG_AUTH: [false, true],
} as const;

type _FlagMap = typeof flagMap;

export type FlagKey = keyof _FlagMap;
export type FlagValue<K extends FlagKey = FlagKey> = _FlagMap[K][number];

export type FlagMap = {
  [K in FlagKey]: FlagValue<K>;
};

export type FlagsState = {
  [K in FlagKey]?: FlagValue<K> | undefined;
};

export interface UserSettings extends Omit<TimestampMetadata, "dateDeleted"> {
  theme?: "system" | "light" | "dark";
  hideWebAppStorePopUp?: boolean;
  flags?: FlagsState;
}

export interface State {
  settings: UserSettings | null;
}

export type UserSettingKey = keyof Pick<
  UserSettings,
  "theme" | "hideWebAppStorePopUp"
>;
export type UserSettingValue<K extends UserSettingKey = UserSettingKey> =
  UserSettings[K];
