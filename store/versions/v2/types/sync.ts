// NOTE: This is in redux, so any breaking changes needs a new version, additive changes are fine
// Avoid booleans, unless it's a feature toggle, prefer strings. Otherwise if we change a feature
// from boolean to having some different states we may miss some conditional checks that were just
// doing a truthy check.

import { DateString } from "./types";

export interface State {
  lastSynced: DateString | null;
  lastPushed: DateString | null;
  lastPulled: DateString | null;
}
