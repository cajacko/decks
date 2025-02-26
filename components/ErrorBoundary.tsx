import { Component, ErrorInfo, ReactNode } from "react";
import AppError from "@/classes/AppError";
import { LogLevel } from "@/utils/logger";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  logLevel?: LogLevel;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(unknownError: Error, errorInfo: ErrorInfo) {
    const appError = AppError.getError(unknownError, "", errorInfo);

    const logLevel: LogLevel = this.props.logLevel ?? "warn";

    appError.log(logLevel);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
