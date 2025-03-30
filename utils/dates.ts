import { DateString } from "@/store/types";

export function dateToDateString(date: Date): DateString {
  return date.toISOString() as DateString;
}
