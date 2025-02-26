// Probably the only file that's allowed to console.log...
/* eslint-disable no-console */
// import * as Sentry from "@sentry/nextjs";
import cloneDeep from "lodash/cloneDeep";

// NOTE: Comments kept from previous implementation, add back when we set up Sentry

export function safeData(data: unknown): unknown {
  try {
    // cloneDeep can help ensure we don't hit some next errors where it thinks we've switched to
    // dynamic mode by trying to convert something like the page searchParams to json.
    return JSON.stringify(cloneDeep(data));
  } catch {
    return data;
  }
}

// function extra(data: unknown): any {
//   return { data: safeData(data) };
// }

const logger = {
  /**
   * Lets us know where the user is in the journey
   */
  breadcrumb: (breadcrumb: string | Error) => {
    const message =
      breadcrumb instanceof Error ? breadcrumb.message : breadcrumb;

    if (process.env.EXPO_PUBLIC_LOGGER_DEBUG === "true") {
      console.debug(`Breadcrumb: ${message}`);
    }

    // Sentry.addBreadcrumb({
    //   message,
    //   level: "info",
    // });
  },
  /**
   * Gives us as devs useful context on what's happening in the code
   */
  debug: (error: string | Error) => {
    const message = error instanceof Error ? error.message : error;

    if (process.env.EXPO_PUBLIC_LOGGER_DEBUG === "true") {
      console.debug(message);
    }

    // Sentry.addBreadcrumb({
    //   message,
    //   level: "debug",
    // });
  },
  /**
   * This isn't something we want to happen, but will happen occasionally and we want to know how
   * often it does e.g. api requests failing (may happen if they go down, but we don't expect many,
   * or only expect during an outage period).
   */
  info: (error: Error) => {
    console.warn(error);

    // Sentry.captureException(error, {
    //   extra: extra("data" in error ? error.data : "No data passed"),
    //   captureContext: {
    //     level: "info",
    //   },
    // });
  },
  /**
   * Something unexpected has happened, but it's handled and shouldn't affect the user much, they
   * should still be able to achieve their goals, but might be mildly inconvenienced
   */
  warn: (error: Error) => {
    console.warn(error);

    // Sentry.captureException(error, {
    //   extra: extra("data" in error ? error.data : "No data passed"),
    //   captureContext: {
    //     level: "warning",
    //   },
    // });
  },
  /**
   * Something unexpected has happened, and it's not handled, the user will be affected and won't be
   * able to achieve their goals, we still expect to be able to tell the user this though and they
   * should be able to still make use of other features and services
   */
  error: (error: Error) => {
    console.error(error);

    // Sentry.captureException(error, {
    //   extra: extra("data" in error ? error.data : "No data passed"),
    //   captureContext: {
    //     level: "error",
    //   },
    // });
  },
  /**
   * Something has critically gone wrong and we can no longer expect to tell the user what's going
   * on, their experience is likely to be pretty bad
   */
  fatal: (error: Error) => {
    console.error(error);

    // Sentry.captureException(error, {
    //   extra: extra("data" in error ? error.data : "No data passed"),
    //   captureContext: {
    //     level: "fatal",
    //   },
    // });
  },
};

export type LogLevel = keyof typeof logger;

export default logger;
