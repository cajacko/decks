import { withAuthenticatedFetch } from "./auth";

export const files = withAuthenticatedFetch<{}>({
  url: "https://www.googleapis.com/drive/v3/files",
  method: "GET",
});
