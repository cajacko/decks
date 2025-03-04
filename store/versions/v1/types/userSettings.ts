// NOTE: This is in redux, so any breaking changes needs a new version, additive changes are fine
export type FlagMap = {
  USE_DEV_INITIAL_REDUX_STATE: boolean;
  HOLD_MENU_BEHAVIOUR: "tap" | "hold";
  CARD_ANIMATIONS: "enabled" | "disabled";
};

export type FlagKey = keyof FlagMap;
export type FlagValue<K extends FlagKey> = FlagMap[K];
export type FlagsState = Partial<FlagMap>;

export interface State {
  flags?: FlagsState;
}
