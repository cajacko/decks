import { DateString } from "@/store/types";

export function dateToDateString(date: Date): DateString {
  return date.toISOString() as `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;
}
