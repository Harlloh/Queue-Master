import { MdLock, MdLogout } from "react-icons/md";
import { useAuth } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";

function AdminNav() {
    const { session, setAdmin, setSession, setIsAuthenticated, admin } = useAuth()
    const navigate = useNavigate()
    const baseUrl = window.location.origin

    const handleLogOut = async () => {
        const res = await api.get('/auth/logout');
        if (res.data.success) {
            setAdmin(null)
            setSession(null)
            setIsAuthenticated(false)
            navigate('/admin-login')
        }
    }
    return (
        <>
            {/* ── Top nav ─────────────────────────────────────────────── */}
            <header className="bg-[#153619] text-white px-5 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-md">
                <div className="flex items-center gap-3">
                    {/* Logo mark — mirrors the login screen */}
                    <div className="w-8 h-8 rounded-lg bg-[#2b7234] flex items-center justify-center shrink-0">
                        <MdLock className="text-white text-sm" />
                    </div>
                    <div>
                        <span className="font-bold text-sm tracking-widest uppercase">CDS Admin</span>
                        {session?.sessionOpen && (
                            <span className="ml-2.5 text-[10px] font-semibold text-[#25eb2f] bg-[#25eb2f]/10 border border-[#25eb2f]/20 px-2 py-0.5 rounded-full uppercase tracking-widest align-middle">
                                Session Open
                            </span>
                        )}
                    </div>
                </div>


                <button
                    onClick={handleLogOut}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                    <MdLogout className="text-sm" /> Log Out
                </button>
            </header>

            {/* ── Session banner (visible when open) ──────────────────── */}
            {session?.sessionOpen && (
                <div className="bg-[#2b7234]/8 border-b border-[#2b7234]/15 px-5 py-2.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#25eb2f] animate-pulse shrink-0" />
                    <p className="text-xs font-semibold text-[#2b7234]">
                        Active session — {admin?.lgaDetails.name} · {admin?.lgaDetails.activeCdsGroup}
                    </p>
                    {/* <span className="ml-auto text-xs text-slate-500 font-medium">
                        {records.length} checked in
                    </span> */}
                </div>
            )}
            {admin?.lgaDetails?.checkInSlug && (
                <div className="mx-5 my-3 flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Check-in link</span>
                        <Link
                            to={`/${admin.lgaDetails.checkInSlug}`}
                            className="text-xs font-semibold text-[#2b7234] underline underline-offset-2 truncate"
                        >
                            {`${baseUrl}/${admin.lgaDetails.checkInSlug}`}
                        </Link>
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(`${baseUrl}/${admin.lgaDetails.checkInSlug}`)}
                        className="shrink-0 text-[10px] font-semibold text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 active:scale-[0.97] transition"
                    >
                        Copy
                    </button>
                </div>
            )}
        </>

    );
}

export default AdminNav;