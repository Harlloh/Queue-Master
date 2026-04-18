import { Outlet } from "react-router-dom";
import AdminNav from "./adminNav";
import AdminFooter from "./adminFooter";

function AdminLayout() {
    return (
        <section className="min-h-screen bg-[#F4F6FA] font-sans">
            <AdminNav />
            <Outlet />
            <AdminFooter />
        </section>
    );
}

export default AdminLayout;