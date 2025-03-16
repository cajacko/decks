import withDebugLog from "@/utils/withDebugLog";

export default withDebugLog(
  ({ getFlag }) => getFlag("DEBUG_RESOLVE_CARD_DATA"),
  "resolveCardData",
);
