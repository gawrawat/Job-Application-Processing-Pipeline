import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import JobApplicationForm from './components/JobApplicationForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <JobApplicationForm />
    </ThemeProvider>
  );
}

export default App;
