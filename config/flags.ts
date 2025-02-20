const flags: {
  HOLD_MENU_BEHAVIOUR: "user-defined" | "tap" | "hold";
  CARD_ANIMATIONS: "user-defined" | "enabled" | "disabled";
} = {
  HOLD_MENU_BEHAVIOUR: "user-defined",
  CARD_ANIMATIONS: "user-defined",
};

export type Flags = typeof flags;

export default flags;
