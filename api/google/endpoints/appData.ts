import { authenticatedFetch } from "../auth/authenticatedFetch";

const DRIVE_FILES_API = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";

/**
 * Gets the contents of a JSON file in the Google Drive AppData folder.
 */
export async function getAppDataFile<T = unknown>(
  filename: string,
): Promise<T | null> {
  // 1. Search for the file by name
  const list = await authenticatedFetch<{
    files: { id: string }[];
  }>({
    url: `${DRIVE_FILES_API}?spaces=appDataFolder&q=name='${filename}' and trashed=false`,
    method: "GET",
  });

  const fileId = list.files?.[0]?.id;

  if (!fileId) return null;

  // 2. Download the file contents
  return await authenticatedFetch<T>({
    url: `${DRIVE_FILES_API}/${fileId}?alt=media`,
    method: "GET",
  });
}

/**
 * Sets (creates or updates) a JSON file in the Google Drive AppData folder.
 */
export async function setAppDataFile<T = unknown>(
  filename: string,
  data: T,
): Promise<void> {
  // 1. Check if file exists
  const list = await authenticatedFetch<{
    files: { id: string }[];
  }>({
    url: `${DRIVE_FILES_API}?spaces=appDataFolder&q=name='${filename}' and trashed=false`,
    method: "GET",
  });

  const fileId = list.files?.[0]?.id;
  const metadata = {
    name: filename,
    parents: ["appDataFolder"],
  };

  if (fileId) {
    // 2a. Update existing file
    await authenticatedFetch({
      url: `${DRIVE_UPLOAD_API}/${fileId}?uploadType=media`,
      method: "PATCH",
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

    await authenticatedFetch({
      url: `${DRIVE_UPLOAD_API}?uploadType=multipart`,
      method: "POST",
      headers: {
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    });
  }
}

export function removeAppDatafile(filename: string) {
  return authenticatedFetch({
    url: `${DRIVE_FILES_API}?spaces=appDataFolder&q=name='${filename}' and trashed=false`,
    method: "DELETE",
  });
}
