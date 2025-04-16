import { useAppSelector } from "@/store/hooks";
import { UserSettings } from "@/store/types";
import { Flags } from "@/utils/flags";
import { selectFlag, selectFlags } from "@/store/selectors/flags";

export default function useFlag<FlagKey extends UserSettings.FlagKey>(
  key: FlagKey,
): UserSettings.FlagValue<FlagKey> {
  return useAppSelector((state) =>
    selectFlag(state, { key }),
  ) as UserSettings.FlagValue<FlagKey>;
}

export function useFlags<FlagKeys extends UserSettings.FlagKey[]>(
  ...keys: FlagKeys
): Flags<FlagKeys> {
  return useAppSelector((state) => selectFlags(state, { keys }));
}
