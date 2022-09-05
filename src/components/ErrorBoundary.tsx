import { Grid, Typography } from "@mui/material";
import { Component } from "react";
import uhh from '../images/uhhh.png';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component {
  state: ErrorBoundaryState;

  constructor(props: any) {
    super(props);
    this.state = { hasError: true };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.log("Error caught: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Grid container direction='column' bgcolor='#181818' height='100vh' alignItems='center' pt={5}>
          <Typography variant='h4' p={3} sx={{color: '#ebedf1'}}>Oops something went wrong</Typography>
          <Typography variant='h5' p={3} sx={{color: '#ebedf1'}}>An alert has been sent to the team. Please refresh your page.</Typography>
          <img src={uhh} height='10%'/>
        </Grid>
      )
    }

    return this.props.children; 
  }
}