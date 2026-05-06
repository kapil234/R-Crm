import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Context from "../context";

function Layout() {
  const { userDetails } = useContext(Context);

  const showSidebar =
    userDetails?.role === "Admin" || userDetails?.role === "Agent";

  return (
    <div className="flex">

      {showSidebar && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <Header />

        <main
          className={`mt-16  bg-gray-100 min-h-screen ${
            showSidebar ? "md:ml-64 ml-0" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;