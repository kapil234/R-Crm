import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Context from "../context";
import SummaryApi from "../common";

function Header() {
  const { userDetails, setUserDetails, setIsSidebarOpen } = useContext(Context);
  const navigate = useNavigate();

  const isSidebarVisible =
    userDetails?.role === "Admin" || userDetails?.role === "Agent";

  const handleLogout = async () => {
    try {
      await fetch(SummaryApi.logout.url, {
        method: SummaryApi.logout.method,
        credentials: "include",
      });

      setUserDetails(null);
      navigate("/");
    } catch (err) {
      console.log("Logout Error:", err);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 h-14 sm:h-16 bg-white shadow-md z-50 transition-all duration-200
        ${isSidebarVisible ? "md:left-64 left-0" : "left-0"}
      `}
    >
      <div className="h-full w-full flex items-center justify-between px-3 sm:px-6">

        {/* LEFT */}
        <div className="flex items-center gap-2">

          {/* ✅ MOBILE BUTTON */}
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="md:hidden text-xl p-2 hover:bg-gray-100 rounded-lg"
          >
            ☰
          </button>

          {/* ✅ LOGO: Hidden on Desktop only if Sidebar is visible */}
          <Link 
            to="/" 
            className={`flex items-center gap-2 ${isSidebarVisible ? "md:hidden" : "flex"}`}
          >
            <h2 className="text-lg sm:text-2xl font-bold">🏢 CRM</h2>
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-4">

          {!userDetails ? (
            <div className="flex gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm md:text-base rounded-full text-white bg-red-600 hover:bg-red-700"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm md:text-base rounded-full text-green-600 border border-green-600 hover:bg-green-100"
              >
                Signup
              </Link>
            </div>
          ) : (
            <>
              <span className="hidden sm:block text-xs sm:text-sm text-gray-600">
                Hi, {userDetails.name}
              </span>

              <button
                onClick={handleLogout}
                className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm md:text-base rounded-full text-white bg-gray-700 hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export default Header;