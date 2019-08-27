import React, {ErrorInfo} from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState = {hasError: false};

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(error, errorInfo.componentStack);
    }
  }

  render() {
    if ((this.state as ErrorBoundaryState).hasError) {
      return (
        <div>
          Something went wrong...
        </div>
      );
    }

    return this.props.children;
  }
}
