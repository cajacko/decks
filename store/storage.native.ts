import AsyncStorage, {
  AsyncStorageStatic,
} from "@react-native-async-storage/async-storage"; // Uses AsyncStorage for native
import AppError from "@/classes/AppError";
import stringSize from "@/utils/stringSize";
import * as FileSystem from "expo-file-system";

/**
 * Only allow alphanumeric characters in the key.
 */
function sanitiseKey(key: string) {
  return key.replace(/[^a-zA-Z0-9]/g, "_");
}

const shouldLogSize = false;

const dir = FileSystem.cacheDirectory + "redux/";
const fileUri = (key: string) => dir + `${sanitiseKey(key)}.txt`;

// Checks if gif directory exists. If not, creates it
async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(dir);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

const storage: AsyncStorageStatic = {
  ...AsyncStorage,
  setItem: async (key, value) => {
    try {
      if (shouldLogSize) {
        const size = stringSize(value);

        // eslint-disable-next-line no-console
        console.log(
          `Persisting ${key} to expo-file-system. Size: ${size}. Key: ${key}`,
        );
      }

      await ensureDirExists();

      await FileSystem.writeAsStringAsync(fileUri(key), value);
    } catch (error) {
      AppError.getError(
        error,
        `Could not persist store to expo-file-system`,
      ).log("error");

      throw error;
    }
  },
  getItem: async (key) => {
    try {
      await ensureDirExists();

      const fileInfo = await FileSystem.getInfoAsync(fileUri(key));

      if (!fileInfo.exists) {
        return null;
      }

      const value = await FileSystem.readAsStringAsync(fileUri(key));

      return value;
    } catch (error) {
      AppError.getError(error, `Could not get store from expo-file-system`).log(
        "error",
      );

      throw error;
    }
  },
  removeItem: async (key) => {
    try {
      await ensureDirExists();

      const fileInfo = await FileSystem.getInfoAsync(fileUri(key));

      if (!fileInfo.exists) {
        return;
      }

      await FileSystem.deleteAsync(fileUri(key));
    } catch (error) {
      AppError.getError(
        error,
        `Could not remove store from expo-file-system`,
      ).log("error");

      throw error;
    }
  },
};

export default storage;
