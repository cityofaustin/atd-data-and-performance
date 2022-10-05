import React from "react";
import ErrorFallback from "../components/ErrorFallback";
// see: https://nextjs.org/docs/advanced-features/error-handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
    // bind reset method
    this.resetError = this.resetError.bind(this);
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  resetError() {
    this.setState({
      hasError: false,
    });
  }

  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      const FallbackComponent = this.props.FallbackComponent;
      return <FallbackComponent resetError={this.resetError} />;
    }
    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
