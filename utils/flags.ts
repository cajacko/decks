import { defaultFlags, flagOverrides } from "@/constants/flags";
import { UserSettings, RootState } from "@/store/types";
import { selectUserSettingsFlag } from "@/store/slices/userSettings";

export type Flags<FlagKeys extends UserSettings.FlagKey[]> = {
  [MapKey in FlagKeys[number]]: UserSettings.FlagValue<MapKey>;
};

export function getFlag<FlagKey extends UserSettings.FlagKey>(
  key: FlagKey,
  state: RootState | null,
): UserSettings.FlagValue<FlagKey> {
  const devOverrideValue = flagOverrides[key];

  if (devOverrideValue !== undefined) return devOverrideValue;

  if (state !== null) {
    const userSettingsValue = selectUserSettingsFlag(state, { key });

    if (userSettingsValue !== undefined) return userSettingsValue;
  }

  return defaultFlags[key];
}

export function getFlags<FlagKeys extends UserSettings.FlagKey[]>(
  keys: FlagKeys,
  state: RootState | null,
): Flags<FlagKeys> {
  return keys.reduce((acc, key) => {
    // This does work so yay
    // @ts-ignore
    acc[key] = getFlag(key, state);

    return acc;
  }, {} as Flags<FlagKeys>);
}
