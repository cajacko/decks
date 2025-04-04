import * as Types from "../types";
import { setState } from "./state";
import updateTokens from "./updateTokens";

export default async function processTokens({
  getUser,
  tokens,
  type,
}: {
  type: Types.LoggedInState["type"];
  tokens: Types.GoogleAuthTokens;
  getUser: () => Promise<Types.GoogleUser>;
}): Promise<Types.LoggedInState> {
  setState({
    type: "AUTH_FROM_REFRESH",
    tokens,
    user: null,
  });

  let state: Types.LoggedInState;

  try {
    const user = await getUser();

    state = await updateTokens<Types.LoggedInState>({
      type,
      tokens,
      user,
    });
  } catch {
    state = await updateTokens<Types.LoggedInState>({
      type,
      tokens,
      user: null,
    });
  }

  return state;
}
