/**
 * When we can't find the data we need to render the card what should happen?
 * - "throw" will throw an error
 * - "log" will log a error and return null
 * - "ignore" will return null
 */
export type NullBehaviour =
  | "throw"
  | "log"
  | "fallback"
  | "log-and-fallback"
  | "ignore";
