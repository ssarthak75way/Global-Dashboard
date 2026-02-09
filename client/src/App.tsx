import { useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Board from "./pages/Board";
import Feed from "./pages/Feed";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const styles = {
    container: {
      padding: "2rem",
      textAlign: "center" as const,
      color: "red"
    },
    button: {
      padding: "0.5rem 1rem",
      marginTop: "1rem",
      cursor: "pointer"
    }
  };

  return (
    <div role="alert" style={styles.container}>
      <h2>Something went wrong:</h2>
      <pre>{error instanceof Error ? error.message : String(error)}</pre>
      <button onClick={resetErrorBoundary} style={styles.button}>Try again</button>
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/signup", element: <Signup /> },
      { path: "/verify-otp", element: <VerifyOtp /> },
      { path: "/login", element: <Login /> },
      { path: "/", element: <Navigate to="/login" replace /> }
    ]
  },
  {
    element: <PrivateLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/profile", element: <Profile /> },
      { path: "/board", element: <Board /> },
      { path: "/feed", element: <Feed /> }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />
  }
]);

const AppContent = () => {
  const { theme } = useTheme();

  const muiTheme = useMemo(() =>
    createTheme(getTheme(theme)),
    [theme]);

  // Pass theme to router context if needed, but here wrapping RouterProvider is sufficient
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
