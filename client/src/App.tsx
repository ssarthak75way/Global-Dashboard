import { useMemo, lazy, Suspense } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from "@mui/material";
import { getTheme } from "./theme";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Signup = lazy(() => import("./pages/Signup"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Board = lazy(() => import("./pages/Board"));
const Feed = lazy(() => import("./pages/Feed"));
const Resume = lazy(() => import("./pages/Resume"));
const Messages = lazy(() => import("./pages/Messages"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Settings = lazy(() => import("./pages/Settings"));
const LikedPosts = lazy(() => import("./pages/LikedPosts"));
const CommentedPosts = lazy(() => import("./pages/CommentedPosts"));
const InfiniteFeed = lazy(() => import("./pages/InfiniteFeed"));
import { SocketProvider } from "./context/SocketContext";
const PublicDocumentation = lazy(() => import("./pages/PublicDocumentation"));
const NotFound = lazy(() => import("./pages/NotFound"));
import ScrollToTop from "./components/ScrollToTop";

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      bgcolor: 'background.default'
    }}
  >
    <CircularProgress size={60} thickness={4} />
  </Box>
);

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
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage />
      </Suspense>
    )
  },
  {
    path: "/guide",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PublicDocumentation />
      </Suspense>
    )
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/signup",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Signup />
          </Suspense>
        )
      },
      {
        path: "/verify-otp",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <VerifyOtp />
          </Suspense>
        )
      },

      {
        path: "/login",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        )
      }
    ]
  },
  {
    element: <PrivateLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        )
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Profile />
          </Suspense>
        )
      },
      {
        path: "/profile/:userId",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Profile />
          </Suspense>
        )
      },
      {
        path: "/board",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Board />
          </Suspense>
        )
      },
      {
        path: "/feed",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Feed />
          </Suspense>
        )
      },
      {
        path: "/resume",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Resume />
          </Suspense>
        )
      },
      {
        path: "/messages",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Messages />
          </Suspense>
        )
      },
      {
        path: "/documentation",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Documentation />
          </Suspense>
        )
      },
      {
        path: "/settings",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Settings />
          </Suspense>
        )
      },
      {
        path: "/settings/likes",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LikedPosts />
          </Suspense>
        )
      },
      {
        path: "/settings/comments",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CommentedPosts />
          </Suspense>
        )
      },
      {
        path: "/infinite",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <InfiniteFeed />
          </Suspense>
        )
      }
    ]
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    )
  }
]);

const AppContent = () => {
  const { theme } = useTheme();

  const muiTheme = useMemo(() =>
    createTheme(getTheme(theme)),
    [theme]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <ScrollToTop />
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <SocketProvider>
              <AppContent />
            </SocketProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
