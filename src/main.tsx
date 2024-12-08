import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { OfficeProvider } from './contexts/OfficeContext';
import { StaffProvider } from './contexts/StaffContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ModuleProvider>
            <OfficeProvider>
              <StaffProvider>
                <App />
              </StaffProvider>
            </OfficeProvider>
          </ModuleProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);