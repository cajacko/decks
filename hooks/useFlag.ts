import { useAppSelector } from "@/store/hooks";
import { UserSettings } from "@/store/types";
import { getFlag, getFlags, Flags } from "@/utils/flags";

export default function useFlag<FlagKey extends UserSettings.FlagKey>(
  key: FlagKey,
): UserSettings.FlagValue<FlagKey> {
  return useAppSelector((state) => getFlag(key, state));
}

export function useFlags<FlagKeys extends UserSettings.FlagKey[]>(
  ...keys: FlagKeys
): Flags<FlagKeys> {
  return useAppSelector((state) => getFlags(keys, state));
}
