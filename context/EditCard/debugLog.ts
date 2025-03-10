import withDebugLog from "@/utils/withDebugLog";

export default withDebugLog(
  ({ getFlag }) => getFlag("DEBUG_EDIT_CARD"),
  "EditCard",
);
