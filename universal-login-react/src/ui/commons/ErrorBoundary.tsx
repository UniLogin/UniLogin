import React, {ErrorInfo} from 'react';
import {ErrorMessage} from './ErrorMessage';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState = {hasError: false, message: ''};

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      message: error.toString(),
    });
    if (process.env.NODE_ENV !== 'test') {
      console.error(error, errorInfo.componentStack);
    }
  }

  render() {
    if ((this.state as ErrorBoundaryState).hasError) {
      return <ErrorMessage
        title={'Something went wrong'}
        message={this.state.message}
      />;
    }

    return this.props.children;
  }
}
