import { UserSettings } from "@/store/types";
import { getFlag } from "@/store/combinedSelectors/flags";
import logger from "@/utils/logger";

export default function withDebugLog(
  shouldLog: (helpers: {
    getFlag: <FlagKey extends UserSettings.FlagKey>(
      flagKey: FlagKey,
    ) => UserSettings.FlagValue<FlagKey>;
  }) => boolean,
  prepend: string,
) {
  return function debugLog(...args: [log: string, props?: unknown]) {
    if (!shouldLog({ getFlag })) return;

    const logTitle = `${prepend}: ${args[0]}`;

    logger.debug(logTitle);

    if (args.length > 1) {
      // eslint-disable-next-line no-console
      console.log(logTitle, args[1]);
    } else {
      // eslint-disable-next-line no-console
      console.log(logTitle);
    }
  };
}
