import { NavLink, Outlet } from "react-router";
import { 
  Phone, 
  Pill, 
  Users, 
  Calendar, 
  Megaphone,
  Activity
} from "lucide-react";

const navItems = [
  { to: "/", icon: Phone, label: "Voice Agent" },
  { to: "/patients", icon: Users, label: "Patients" },
  { to: "/appointments", icon: Calendar, label: "Appointments" },
  { to: "/medicines", icon: Pill, label: "Medicines" },
  { to: "/campaigns", icon: Megaphone, label: "Campaigns" },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground tracking-tight">MediVoice</h1>
              <p className="text-xs text-muted-foreground">Healthcare AI Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="px-3 py-2 bg-accent/50 rounded-lg">
            <p className="text-xs text-muted-foreground">System Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-accent-foreground">All systems operational</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
