import logger, { LogLevel, safeData } from "@/utils/logger";

/**
 * When used in try/catch .catch follow this pattern:
 *
 * ```typescript
 * try {
 *   // Code that might throw an error
 * } catch (unknownError: unknown) { // specifically call the error unknownError to make it clear
 *   throw AppError.getError(unknownError, "Error message", data);
 * }
 * ```
 */
class AppError extends Error {
  private data: unknown;

  constructor(message: string, data?: unknown) {
    super(message);

    this.data = safeData(data);

    // Restore prototype chain
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      // Fallback for older versions of Node.js or browsers like IE11
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)["__proto__"] = actualProto;
    }

    // Maintain proper stack trace for where our error was generated (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
  /**
   * Levels
   * - breadcrumb - Lets us know where the user is in the journey
   * - debug - Gives us as devs useful context on what's happening in the code
   * - info - This isn't something we want to happen, but will happen occasionally and we want to
   *   know how often it does e.g. api requests failing (may happen if they go down, but we don't
   *   expect many, or only expect during an outage period).
   * - warn - Something unexpected has happened, but it's handled and shouldn't affect the user
   *   much, they should still be able to achieve their goals, but might be mildly inconvenienced
   * - error - Something unexpected has happened, and it's not handled, the user will be affected
   *   and won't be able to achieve their goals, we still expect to be able to tell the user this
   *   though and they
   * should be able to still make use of other features and services
   * - fatal - Something has critically gone wrong and we can no longer expect to tell the user
   *   what's going on, their experience is likely to be pretty bad
   */
  public log(level: LogLevel): AppError {
    logger[level](this);

    return this;
  }

  public prependMessage(message: string) {
    this.message = `${message}\n${this.message}`;
  }

  static getError(
    error: unknown,
    defaultMessage: string,
    data?: unknown,
  ): AppError {
    if (error instanceof AppError) {
      error.prependMessage(defaultMessage);

      return error;
    }

    if (error instanceof Error) {
      const errorObj = new AppError(error.message, { error, data });

      errorObj.prependMessage(defaultMessage);

      return errorObj;
    }

    if (typeof error === "string") {
      const errorObj = new AppError(error, data);

      errorObj.prependMessage(defaultMessage);

      return errorObj;
    }

    return new AppError(defaultMessage, error);
  }
}

export default AppError;
