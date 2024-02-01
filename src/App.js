import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './Pages/Home';
import Backoffice from './Pages/Backoffice';
import './App.css';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      'sans-serif',
    ].join(','),
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="backoffice" element={<Backoffice />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
