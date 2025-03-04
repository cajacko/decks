// NOTE: This is in redux, so any breaking changes needs a new version, additive changes are fine
// Avoid booleans, unless it's a feature toggle, prefer strings. Otherwise if we change a feature
// from boolean to having some different states we may miss some conditional checks that were just
// doing a truthy check.
export type FlagMap = {
  USE_DEV_INITIAL_REDUX_STATE: boolean;
  HOLD_MENU_BEHAVIOUR: "tap" | "hold";
  CARD_ANIMATIONS: "enabled" | "disabled";
  SKELETON_LOADER: "enabled" | "disabled";
  SCREEN_ANIMATIONS:
    | "react-navigation"
    | "custom-fade-in-content"
    | "custom-fade-out-top-background"
    | "disabled";
  NAVIGATION_STACK_ANIMATIONS: "slide" | "disabled";
  NAVIGATION_TAB_ANIMATIONS: "shift" | "fade" | "disabled";
  SCREENS_FREEZE_ON_BLUR: boolean;
  GENERAL_LAYOUT_ANIMATIONS: "enabled" | "disabled";
};

export type FlagKey = keyof FlagMap;
export type FlagValue<K extends FlagKey> = FlagMap[K];
export type FlagsState = Partial<FlagMap>;

export interface State {
  flags?: FlagsState;
}
