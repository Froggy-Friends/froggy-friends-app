import { Grid, Typography } from "@mui/material";
import { Component } from "react";
import uhh from '../images/uhhh.png';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundaryLocal extends Component {
  state: ErrorBoundaryState;

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.log("Local Error caught: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
        return <h1>Something went wrong.</h1>
    }
    return this.props.children; 
  }
}