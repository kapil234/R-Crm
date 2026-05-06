import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Context from "./context";
import SummaryApi from "./common";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ================= USER STATE =================
  const [userDetails, setUserDetails] = useState(null);

  // ================= DASHBOARD GLOBAL STATE =================
  const [globalData, setGlobalData] = useState({
    leads: [],
    deals: [],
    followUps: [],
    activities: []
  });

  const [loading, setLoading] = useState(false);

  // ================= FETCH USER =================
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(SummaryApi.User.url, {
        method: SummaryApi.User.method,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setUserDetails(data.data);
      } else {
        setUserDetails(null);
      }
    } catch (err) {
      console.error("User Fetch Error:", err);
      setUserDetails(null);
    }
  };

  // ================= FETCH GLOBAL CRM DATA =================
  const fetchGlobalData = useCallback(async () => {
    try {
      setLoading(true);

      const [leadRes, dealRes, followRes, activityRes] = await Promise.all([
        fetch(SummaryApi.leads.url, { credentials: "include" }),
        fetch(SummaryApi.alldeals.url, { credentials: "include" }),
        fetch(SummaryApi.getFollowup.url, { credentials: "include" }),
        fetch(SummaryApi.allactivity.url, { credentials: "include" }),
      ]);

      const [leadData, dealData, followData, activityData] = await Promise.all([
        leadRes.json(),
        dealRes.json(),
        followRes.json(),
        activityRes.json(),
      ]);

      setGlobalData({
        leads: leadData.success ? leadData.data : [],
        deals: dealData.success ? dealData.data : [],
        followUps: followData.success ? followData.data || [] : [],
        activities: activityData.success ? activityData.data || [] : [],
      });

    } catch (err) {
      console.error("Global Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= LOAD ON APP START =================
  useEffect(() => {
    fetchUserDetails();
    fetchGlobalData();
  }, [fetchGlobalData]);

  // ================= CONTEXT VALUE =================
  const contextValue = {
    userDetails,
    setUserDetails,
    fetchUserDetails,
    isSidebarOpen,
    setIsSidebarOpen,
    ...globalData,
     setGlobalData,
    loading,
    fetchGlobalData
  };

  return (
    <GoogleOAuthProvider clientId="340451023631-ladlo1mlpsp018l3jecgmku8i02h98t0.apps.googleusercontent.com">
      <Context.Provider value={contextValue}>
        <Layout>
          <Outlet />
        </Layout>
      </Context.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;