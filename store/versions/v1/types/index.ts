import * as UserSettings from "./userSettings";
import * as Decks from "./decks";
import * as Tabletops from "./tabletops";
import * as Cards from "./cards";
import * as Templates from "./templates";

export * from "./helpers";

export { UserSettings, Decks, Tabletops, Cards, Templates };

export enum SliceName {
  UserSettings = "userSettings",
  Decks = "decks",
  Tabletops = "tabletops",
  Cards = "cards",
  Templates = "templates",
}

export interface RootState {
  [SliceName.UserSettings]: UserSettings.State;
  [SliceName.Decks]: Decks.State;
  [SliceName.Tabletops]: Tabletops.State;
  [SliceName.Cards]: Cards.State;
  [SliceName.Templates]: Templates.State;
}
