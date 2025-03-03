import { useAppSelector } from "@/store/hooks";
import {
  selectUserSettings,
  UserSettingsState,
} from "@/store/slices/userSettings";
import flags, { Flags } from "@/constants/flags";

export default function useFlag<
  // This is okay in this generic, it is still strongly typed when used
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  L extends (flags: Flags, userSettings: UserSettingsState) => any,
>(logic: L): ReturnType<L> {
  const userSettings = useAppSelector(selectUserSettings);

  return logic(flags, userSettings);
}

export const useAnimateCardMovement = () =>
  useFlag(
    (flags, userSettings): boolean =>
      (flags.CARD_ANIMATIONS === "user-defined"
        ? userSettings.animateCardMovement
        : flags.CARD_ANIMATIONS === "enabled") ?? true,
  );

export const useHoldMenuBehaviour = () =>
  useFlag(
    (flags, userSettings): "tap" | "hold" =>
      (flags.HOLD_MENU_BEHAVIOUR === "user-defined"
        ? userSettings.holdMenuBehaviour
        : flags.HOLD_MENU_BEHAVIOUR) ?? "hold",
  );
