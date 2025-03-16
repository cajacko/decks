import { Templates } from "@/store/types";

type Value = Templates.ValidatedValue["value"] | undefined;

export default function getHasChanges(a: Value, b: Value) {
  return a !== b;
}
