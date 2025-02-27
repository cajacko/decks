import logger from "@/utils/logger";

export default function debugLog(log: string, props?: unknown) {
  if (process.env.EXPO_PUBLIC_DEBUG_BOTTOM_DRAWER !== "true") return;

  const logTitle = `BottomDrawer: ${log}`;

  logger.debug(logTitle);

  // eslint-disable-next-line no-console
  console.log(logTitle, props);
}
