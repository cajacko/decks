import { useAppSelector } from "@/store/hooks";
import { UserSettings, RootState } from "@/store/types";
import { getFlag, getFlags, Flags } from "@/utils/flags";
import { createCachedSelector } from "re-reselect";

const selectFlag = createCachedSelector(
  (_: RootState, props: { key: UserSettings.FlagKey }): UserSettings.FlagKey =>
    props.key,
  (state: RootState): UserSettings.FlagsState | undefined =>
    state.userSettings.flags,
  (key: UserSettings.FlagKey, state?: UserSettings.FlagsState) =>
    getFlag(key, state),
)((_, props) => props.key);

export default function useFlag<FlagKey extends UserSettings.FlagKey>(
  key: FlagKey,
): UserSettings.FlagValue<FlagKey> {
  return useAppSelector((state) =>
    selectFlag(state, { key }),
  ) as UserSettings.FlagValue<FlagKey>;
}

const selectFlags = createCachedSelector(
  (_: RootState, props: { keys: UserSettings.FlagKey[] }): string =>
    props.keys.join("|"),
  (state: RootState): UserSettings.FlagsState | undefined =>
    state.userSettings.flags,
  (keys: string, state?: UserSettings.FlagsState) =>
    getFlags(keys.split("|") as UserSettings.FlagKey[], state),
)((_, props) => props.keys.join("|"));

export function useFlags<FlagKeys extends UserSettings.FlagKey[]>(
  ...keys: FlagKeys
): Flags<FlagKeys> {
  return useAppSelector((state) => selectFlags(state, { keys }));
}
