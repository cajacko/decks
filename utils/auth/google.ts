import * as AuthSession from "expo-auth-session";
import React from "react";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

const CLIENT_ID =
  "463705869802-j8udeeiqgsr8ipfknulpd2gs00ua5rnd.apps.googleusercontent.com";
// const REDIRECT_URI ="https://auth.expo.io/@charliejackson/decks";
const REDIRECT_URI = AuthSession.makeRedirectUri({});

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

export const useGoogleAuth = (props: { redirectUri?: string } = {}) => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri: props.redirectUri ?? REDIRECT_URI,
    },
    discovery,
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      // const { access_token } = response.authentication!;
      // Store token and use it for API calls
    }
  }, [response]);

  return { promptAsync, request, response };
};
