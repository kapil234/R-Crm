import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Login from "../components/Login.jsx";

import Leads from "../pages/Leads.jsx";
import Properties from "../pages/Properties.jsx";

import Clients from "../pages/Clients.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Deals from "../pages/Deals.jsx";
import PropertyDetails from "../components/PropertyDetails.jsx";
import ClientProfile from "../pages/ClientsProfile.jsx";
import AddInteraction from "../components/AddInteractions.jsx";
import DealDetail from "../pages/DealDetail.jsx";
import AddProperty from "../components/AddProperties.jsx";
import SignUp from "../components/SignUp.jsx";

import AgentList from "../pages/AgentsList.jsx";
import AgentDetails from "../components/agentsDetails.jsx";
import AddClient from "../components/addClients.jsx";
import AddLead from "../components/addLead.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "leads",
        element: <Leads />,
      },
      {
        path: "/properties",
        element: <Properties />,
      },
      {
        path: "/",
        element: <Properties />,
      },
      {
        path: "clients",
        element: <Clients />,
      },
      {
        path: "agents",
        element: <AgentList />,
      },
      { path: "agent/:id", element: <AgentDetails /> },
      {
        path: "deals",
        element: <Deals />,
      },
      {
        path: "propertydetail/:id",
        element: <PropertyDetails />,
      },

      {
        path: "client/:id",
        element: <ClientProfile />,
      },
      {
        path: "/client/:id/addinteractions",
        element: <AddInteraction />,
      },
      {
        path: "/deal/:id",
        element: <DealDetail />,
      },
      {
        path: "addproperties",
        element: <AddProperty />,
      },
      {
        path: "/property/edit/:id",
        element: <AddProperty />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/client/add",
        element: <AddClient />,
      },
      {
        path:"/lead/add",
        element:<AddLead/>
      }
    ],
  },
]);
export default router;
