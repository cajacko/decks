import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const setItem = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

export const deleteItem = async (key: string) => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const getItems = async <K extends string[]>(
  ...keys: K
): Promise<Record<K[number], string | null>> => {
  const items: Record<K[number], string | null> = {} as Record<
    K[number],
    string | null
  >;

  await Promise.all(
    keys.map(async (key) => {
      items[key as K[number]] = await getItem(key);
    }),
  );

  return items;
};

export const setItems = async (data: Record<string, string | null>) => {
  await Promise.all(
    Object.entries(data).map(async ([key, value]) => {
      if (value === null) {
        await deleteItem(key);
      } else {
        await setItem(key, value);
      }
    }),
  );
};

export const deleteItems = async (...keys: string[]) => {
  await Promise.all(
    keys.map(async (key) => {
      await deleteItem(key);
    }),
  );
};
