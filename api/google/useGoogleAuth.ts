import React from "react";
import * as GoogleAuth from "./auth";

export default function useGoogleAuth() {
  const [state, setState] = React.useState<GoogleAuth.State>(
    GoogleAuth.getState,
  );

  React.useEffect(() => {
    const { remove } = GoogleAuth.listenToState(setState);

    return remove;
  }, []);

  return {
    ...state,
    logout: GoogleAuth.logout,
    requestAuth: GoogleAuth.requestAuth,
    refreshAuth: GoogleAuth.refreshAuth,
  };
}
