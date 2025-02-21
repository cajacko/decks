const flags: {
  USE_DEV_INITIAL_REDUX_STATE: boolean;
  HOLD_MENU_BEHAVIOUR: "user-defined" | "tap" | "hold";
  CARD_ANIMATIONS: "user-defined" | "enabled" | "disabled";
} = {
  USE_DEV_INITIAL_REDUX_STATE: true,
  HOLD_MENU_BEHAVIOUR: "user-defined",
  CARD_ANIMATIONS: "user-defined",
};

export type Flags = typeof flags;

export default flags;
