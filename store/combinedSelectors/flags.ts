import { UserSettings, RootState } from "@/store/types";
import { getFlag as _getFlag } from "@/utils/flags";
import { createCachedSelector } from "re-reselect";
import { store } from "../store";

export const selectFlag = createCachedSelector(
  (_: RootState, props: { key: UserSettings.FlagKey }): UserSettings.FlagKey =>
    props.key,
  (state: RootState): UserSettings.FlagsState | undefined =>
    state.userSettings.flags,
  (key: UserSettings.FlagKey, state?: UserSettings.FlagsState) =>
    _getFlag(key, state),
)((_, props) => props.key);

export function getFlag<FlagKey extends UserSettings.FlagKey>(
  key: FlagKey,
): UserSettings.FlagValue<FlagKey> {
  return selectFlag(store.getState(), {
    key,
    // Hard to type this, it works though
  }) as UserSettings.FlagValue<FlagKey>;
}
