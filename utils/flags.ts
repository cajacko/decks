import {
  defaultFlags,
  flagOverrides,
  GetFlag,
  flagRelationships,
} from "@/constants/flags";
import { UserSettings } from "@/store/types";

type State =
  | (() => UserSettings.FlagsState)
  | UserSettings.FlagsState
  | undefined
  | null;

function _getFlag<FlagKey extends UserSettings.FlagKey>(
  key: FlagKey,
  state: State,
): UserSettings.FlagValue<FlagKey> {
  const devOverrideValue = flagOverrides[key];

  if (devOverrideValue !== undefined) return devOverrideValue;

  if (state !== null) {
    const finalState = typeof state === "function" ? state() : state;

    // NOTE: We can't use our selector here because it would create a circular dependency
    const userSettingsValue = finalState?.[key];

    if (userSettingsValue !== undefined) return userSettingsValue;
  }

  return defaultFlags[key];
}

export function getFlag<FlagKey extends UserSettings.FlagKey>(
  key: FlagKey,
  state: State,
): UserSettings.FlagValue<FlagKey> {
  const getFlag: GetFlag = (k) => _getFlag(k, state);

  const value = getFlag(key);

  const transform = flagRelationships[key];

  if (!transform) return value;

  return transform(value, getFlag);
}

export function getFlags<FlagKeys extends UserSettings.FlagKey[]>(
  keys: FlagKeys,
  state: State,
): Flags<FlagKeys> {
  return keys.reduce((acc, key) => {
    // This does work so yay
    // @ts-ignore
    acc[key] = getFlag(key, state);

    return acc;
  }, {} as Flags<FlagKeys>);
}

export type Flags<FlagKeys extends UserSettings.FlagKey[]> = {
  [MapKey in FlagKeys[number]]: UserSettings.FlagValue<MapKey>;
};
