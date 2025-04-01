import withDebugLog from "@/utils/withDebugLog";

export default withDebugLog(
  ({ getFlag }) => getFlag("DEBUG_AUTH"),
  "GoogleAuth",
);
