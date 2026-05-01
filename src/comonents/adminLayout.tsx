import { Outlet } from "react-router-dom";
import AdminNav from "./adminNav";
// import AdminFooter from "./adminFooter";
import SidebarItem from "./siebarItem";
import TabBarItem from "./tabBarItem";
import { MdBolt, MdListAlt, MdSettings } from "react-icons/md";
import { useEffect } from "react";
import { useAuth } from "../store/authStore";
import api from "../lib/axios";

function AdminLayout() {
    // const [activeTab, setActiveTab] = useState<TabId>('session');
    const NAV_ITEMS = [
        { to: "/admin", label: "Session", icon: <MdBolt />, end: true },
        { to: "/admin/attendance", label: "Attendance", icon: <MdListAlt /> },
        { to: "/admin/settings", label: "Settings", icon: <MdSettings /> },
    ];
    const { setAdmin, setSession, setIsAuthenticated } = useAuth();
    useEffect(() => {
        const getServerAdminState = async () => {
            try {
                const res = await api.get('/admin/getAdmin');

                if (res.data.success) {
                    const { lgaDetails, session } = res.data;

                    // Build admin object properly
                    setAdmin({
                        id: session.adminId,
                        name: "",
                        email: "",
                        lgaDetails: {
                            name: lgaDetails.name,
                            latitude: lgaDetails.latitude,
                            longitude: lgaDetails.longitude,
                            radius: lgaDetails.radius,
                            updatedAt: lgaDetails.updatedAt,
                            checkInSlug: lgaDetails.checkInSlug,
                        }
                    });

                    setSession({
                        id: session.id,
                        isOpen: session.isOpen,
                        lgaId: session.lgaId,
                        openedAt: session.openedAt,
                        cdsGroupId: "", // you don’t have this → mismatch again
                        cdsGroupName: "",
                    });

                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        getServerAdminState();
    }, []);
    return (
        <section className="h-screen bg-[#F4F6FA] font-sans">
            <AdminNav />
            <div className="flex flex-1">
                <aside className="hidden md:flex flex-col w-48 border-r border-slate-100 bg-white h-screen shrink-0 py-4">
                    {NAV_ITEMS.map(item => (
                        <SidebarItem key={item.to} {...item} />
                    ))}
                </aside>

                <main className="flex-1 p-4 pb-24 md:pb-6 max-w-2xl mx-auto w-full">
                    <Outlet />
                </main>
            </div>

            <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 grid grid-cols-3 z-10`}>
                {NAV_ITEMS.map(item => (
                    <TabBarItem key={item.to} {...item} />
                ))}
            </nav>
            {/* <AdminFooter /> */}
        </section>
    );
}

export default AdminLayout;