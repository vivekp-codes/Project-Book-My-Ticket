import Sidebar from "../Components/SideNavBar/SideBar";
import { useAuth } from "../Context/AuthContext";

export default function DashboardLayout({ children }) {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-white">

      <Sidebar role={role} />

      <div className="p-8 md:ml-[270px] relative z-0">
        {children}
      </div>

    </div>
  );
}
