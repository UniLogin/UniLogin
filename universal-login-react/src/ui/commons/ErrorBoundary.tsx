import React, {ErrorInfo} from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState = {hasError: false, message: 'msg'};

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    this.setState({
      message: (error as any).toString(),
    });
    if (process.env.NODE_ENV !== 'test') {
      console.error(error, errorInfo.componentStack);
    }
  }

  render() {
    if ((this.state as ErrorBoundaryState).hasError) {
      return (
        <div>
          {this.state.message}
        </div>
      );
    }

    return this.props.children;
  }
}
