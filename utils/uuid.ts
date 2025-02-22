import * as Crypto from "expo-crypto";

export default function uuid() {
  return Crypto.randomUUID();
}
