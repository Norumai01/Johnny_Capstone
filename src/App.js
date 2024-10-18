import React from "react";
import AuthPage from "./components/Auth/AuthPage";
import Dashboard from "./components/Social_Hub/Dashboard";
import UserProfile from "./components/Social_Hub/UserProfile";
import CreatePost from "./components/PostCards/CreatePost";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      // Empty object will prevent Chakra from applying its global styles
      body : {

      },
    },
  },
});

// Redirect any users already logged in, into social hub.
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Redirect any users not logged in, to login page.
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {

  return (
    // Allow usage of chakra UI libraries
    <ChakraProvider theme={theme} resetCSS={false}>
      <Router>
        <div className="App">
          {/* Handle routes to navigate to different pages.*/}
          <Routes>
            <Route path="/" element={<PublicRoute> <AuthPage /> </PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute> <UserProfile /> </ProtectedRoute>} />
            <Route path="/create-post" element={<ProtectedRoute> <CreatePost /> </ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
