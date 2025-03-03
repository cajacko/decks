import logger from "@/utils/logger";

export default function debugLog(...args: [log: string, props?: unknown]) {
  if (process.env.EXPO_PUBLIC_DEBUG_BOTTOM_DRAWER !== "true") return;

  const logTitle = `BottomDrawer: ${args[0]}`;

  logger.debug(logTitle);

  if (args.length > 1) {
    // eslint-disable-next-line no-console
    console.log(logTitle, args[1]);
  } else {
    // eslint-disable-next-line no-console
    console.log(logTitle);
  }
}
