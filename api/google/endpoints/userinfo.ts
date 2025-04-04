import { withGoogleFetch } from "../auth/fetch";

export const userInfo = withGoogleFetch<{
  email: string;
  id: string;
  name: string;
  picture: string;
}>({
  url: "https://www.googleapis.com/oauth2/v3/userinfo",
  method: "GET",
});
