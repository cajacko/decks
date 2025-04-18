import * as UserSettings from "./userSettings";
import * as Decks from "./decks";
import * as Tabletops from "./tabletops";
import * as Cards from "./cards";
import * as Templates from "./templates";
import * as Markup from "./markup";
import * as Sync from "./sync";
import * as IncludedData from "./includedData";

export { DateString, TimestampMetadata } from "./types";

export * from "./helpers";

// Don't re-export everything, each file should re-export what it needs in a more semantic way
// export * from "./types";

export {
  UserSettings,
  Decks,
  Tabletops,
  Cards,
  Templates,
  Markup,
  Sync,
  IncludedData,
};

export enum SliceName {
  UserSettings = "userSettings",
  Decks = "decks",
  Tabletops = "tabletops",
  Cards = "cards",
  Templates = "templates",
  Sync = "sync",
  IncludedData = "includedData",
}

export interface RootState {
  [SliceName.UserSettings]: UserSettings.State;
  [SliceName.Decks]: Decks.State;
  [SliceName.Tabletops]: Tabletops.State;
  [SliceName.Cards]: Cards.State;
  [SliceName.Templates]: Templates.State;
  [SliceName.Sync]: Sync.State;
  [SliceName.IncludedData]: IncludedData.State;
}
