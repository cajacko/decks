import * as Types from "../types";
import * as persist from "./persist";
import { setState } from "./state";

export default async function updateTokens(
  state: Types.State,
): Promise<Types.State> {
  setState(state);

  await persist.setState(state);

  return state;
}
