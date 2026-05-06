import { NavLink } from "react-router-dom";
import { useContext } from "react";
import Context from "../context";
import {
  LayoutDashboard,
  Phone,
  Building2,
  Users,
  UserRound,
  Briefcase,
  X,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", path: "/leads", icon: Phone },
  { name: "Properties", path: "/properties", icon: Building2 },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Deals", path: "/deals", icon: Briefcase },
  { name: "Agents", path: "/agents", icon: UserRound, role: "Admin" } 
];

function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen, userDetails } = useContext(Context);

  // ✅ FILTER MENU BASED ON ROLE
  const filteredMenu = menu.filter((item) => {
    if (!item.role) return true; 
    return item.role === userDetails?.role; 
  });

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50 bg-indigo-600 text-white p-6
          transition-transform duration-300 ease-in-out shadow-xl
          
          w-[280px] max-w-[85%]
          md:w-64 md:translate-x-0

          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            <h2 className="text-xl font-bold tracking-tight">CRM LOGO</h2>
          </div>

          <button
            className="p-1 hover:bg-indigo-500 rounded-lg md:hidden transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {filteredMenu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-white text-indigo-600 font-bold shadow-md"
                      : "hover:bg-indigo-500 text-indigo-100"
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-base">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;