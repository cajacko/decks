import AppError from "@/classes/AppError";
import { getState, withAuthenticatedFetch } from "./auth";

const DRIVE_FILES_API = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";

/**
 * Gets the contents of a JSON file in the Google Drive AppData folder.
 */
export async function getAppDataFile<T = unknown>(
  filename: string,
): Promise<T | null> {
  const state = getState();

  if (!state.tokens) throw new AppError("Not authenticated");

  // 1. Search for the file by name
  const list = await withAuthenticatedFetch<{
    files: { id: string }[];
  }>({
    url: `${DRIVE_FILES_API}?spaces=appDataFolder&q=name='${filename}' and trashed=false`,
    method: "GET",
  })(state.tokens);

  const fileId = list.files?.[0]?.id;
  if (!fileId) return null;

  // 2. Download the file contents
  const res = await fetch(`${DRIVE_FILES_API}/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${state.tokens.accessToken}`,
    },
  });

  if (!res.ok) throw new AppError("Failed to fetch file content");

  return await res.json();
}

/**
 * Sets (creates or updates) a JSON file in the Google Drive AppData folder.
 */
export async function setAppDataFile<T = unknown>(
  filename: string,
  data: T,
): Promise<void> {
  const state = getState();

  if (!state.tokens) throw new AppError("Not authenticated");

  const accessToken = state.tokens.accessToken;

  // 1. Check if file exists
  const list = await withAuthenticatedFetch<{
    files: { id: string }[];
  }>({
    url: `${DRIVE_FILES_API}?spaces=appDataFolder&q=name='${filename}' and trashed=false`,
    method: "GET",
  })(state.tokens);

  const fileId = list.files?.[0]?.id;
  const metadata = {
    name: filename,
    parents: ["appDataFolder"],
  };

  if (fileId) {
    // 2a. Update existing file
    await fetch(`${DRIVE_UPLOAD_API}/${fileId}?uploadType=media`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } else {
    // 2b. Create new file
    const boundary = "BOUNDARY_" + Math.random().toString(36).substring(2);
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartBody =
      delimiter +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(metadata) +
      delimiter +
      "Content-Type: application/json\r\n\r\n" +
      JSON.stringify(data) +
      closeDelimiter;

    await fetch(`${DRIVE_UPLOAD_API}?uploadType=multipart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    });
  }
}
