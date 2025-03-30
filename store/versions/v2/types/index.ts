import * as UserSettings from "./userSettings";
import * as Decks from "./decks";
import * as Tabletops from "./tabletops";
import * as Cards from "./cards";
import * as Templates from "./templates";
import * as Markup from "./markup";

export { DateString } from "./types";

export * from "./helpers";

// Don't re-export everything, each file should re-export what it needs in a more semantic way
// export * from "./types";

export { UserSettings, Decks, Tabletops, Cards, Templates, Markup };

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
