import AsyncStorage, {
  AsyncStorageStatic,
} from "@react-native-async-storage/async-storage"; // Uses AsyncStorage for native
import AppError from "@/classes/AppError";
import stringSize from "@/utils/stringSize";

const shouldLogSize = false;

const storage: AsyncStorageStatic = {
  ...AsyncStorage,
  setItem: async (key, value) => {
    try {
      if (shouldLogSize) {
        const size = stringSize(value);

        // eslint-disable-next-line no-console
        console.log(
          `Persisting ${key} to AsyncStorage. Size: ${size}. Key: ${key}`,
        );
      }

      await AsyncStorage.setItem(key, value);
    } catch (error) {
      AppError.getError(error, `Could not persist store to AsyncStorage`).log(
        "error",
      );

      throw error;
    }
  },
  getItem: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      AppError.getError(error, `Could not get store from AsyncStorage`).log(
        "error",
      );

      throw error;
    }
  },
};

export default storage;
