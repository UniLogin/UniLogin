import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    const initialState: ErrorBoundaryState = {hasError: false};
    this.state = initialState;
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true};
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
