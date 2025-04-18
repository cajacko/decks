import { UserSettings, RootState } from "@/store/types";
import { getFlag as _getFlag } from "@/utils/flags";
import { createCachedSelector } from "re-reselect";
import { store } from "../store";
import { getFlags } from "@/utils/flags";

export const selectFlag = createCachedSelector(
  (_: RootState, props: { key: UserSettings.FlagKey }): UserSettings.FlagKey =>
    props.key,
  (state: RootState): UserSettings.FlagsState | undefined =>
    state.userSettings.settings?.flags,
  (key: UserSettings.FlagKey, state?: UserSettings.FlagsState) =>
    _getFlag(key, state),
)((_, props) => props.key);

export const selectFlags = createCachedSelector(
  (_: RootState, props: { keys: UserSettings.FlagKey[] }): string =>
    props.keys.join("|"),
  (state: RootState): UserSettings.FlagsState | undefined =>
    state.userSettings.settings?.flags,
  (keys: string, state?: UserSettings.FlagsState) =>
    getFlags(keys.split("|") as UserSettings.FlagKey[], state),
)((_, props) => props.keys.join("|"));

export function getFlag<FlagKey extends UserSettings.FlagKey>(
  key: FlagKey,
): UserSettings.FlagValue<FlagKey> {
  return selectFlag(store.getState(), {
    key,
    // Hard to type this, it works though
  }) as UserSettings.FlagValue<FlagKey>;
}
