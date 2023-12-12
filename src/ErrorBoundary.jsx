import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.error(error);
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  componentDidMount() {
    window.addEventListener("error", this.handleGlobalError);
  }

  componentWillUnmount() {
    window.removeEventListener("error", this.handleGlobalError);
  }

  handleGlobalError = (event) => {
    event.preventDefault();
    this.setState({ hasError: true });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
