import * as Types from "../types";
import * as persist from "./persist";
import { setState } from "./state";

export default async function updateTokens<S extends Types.State>(
  state: S,
): Promise<S> {
  setState(state);

  await persist.setState(state);

  return state;
}
