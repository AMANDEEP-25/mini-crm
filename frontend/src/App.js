import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import CreateCampaign from "./pages/Create-Campaign";
import PastCampaigns from "./pages/PastCampaigns";

const GOOGLE_CLIENT_ID =
  "12503885902-ovho0d88dshre2p8okncls6em2lr88dn.apps.googleusercontent.com";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Login Success:", credentialResponse);
    localStorage.setItem("token", credentialResponse.credential);
    setIsAuthenticated(true);
  };

  const handleLoginFailure = (error) => {
    console.error("Login Failure:", error);
    setIsAuthenticated(false);
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {!isAuthenticated ? (
        <div>
          <h1>Welcome to CRM System</h1>
          <p>
            Please sign in with your Google account to access the application.
          </p>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </div>
      ) : (
        <Router>
          <div>
            <Navbar onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/create-campaign" element={<CreateCampaign />} />
              {/* <Route path="/campaign-history" element={<CampaignHistory />} /> */}
              <Route path="/past-campaigns" element={<PastCampaigns />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      )}
    </GoogleOAuthProvider>
  );
}

export default App;
