// NOTE: This is in redux, so any breaking changes needs a new version, additive changes are fine
// Avoid booleans, unless it's a feature toggle, prefer strings. Otherwise if we change a feature
// from boolean to having some different states we may miss some conditional checks that were just
// doing a truthy check.

// NOTE: First option is the default
export const flagMap = {
  // User control flags go here
  HOLD_MENU_BEHAVIOUR: ["hold", "tap"],

  // Dev flags
  USE_DEV_INITIAL_REDUX_STATE: [true, false],
  CARD_ANIMATIONS: ["enabled", "disabled"],
  SKELETON_LOADER: ["enabled", "disabled"],
  SCREEN_ANIMATIONS: [
    "disabled",
    "react-navigation",
    "custom-fade-in-content",
    "custom-fade-out-top-background",
  ],
  NAVIGATION_STACK_ANIMATIONS: ["disabled", "slide"],
  NAVIGATION_TAB_ANIMATIONS: ["disabled", "shift", "fade"],
  // Does not play nicely with reanimated effects. When we navigated to tabletop, then to deck edit
  // and then back to tabletop, the stacks wouldn't show. The reanimated opacity value seems to have
  // reset and wouldn't set back to 1
  SCREENS_FREEZE_ON_BLUR: [false, true],
  GENERAL_LAYOUT_ANIMATIONS: ["enabled", "disabled"],
  DEV_MODE: [false, true],
  PURGE_STORE_ON_START: [false, true],

  // Debug logs
  DEBUG_BOTTOM_DRAWER: [false, true],
  DEBUG_AUTO_SAVE: [false, true],
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

export interface State {
  flags?: FlagsState;
}
