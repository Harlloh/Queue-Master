import { useEffect, useState } from "react";
import {
    MdLock,
    MdLockOpen,
    MdMyLocation,
    MdSave,
    MdPersonAdd,
    MdSettings,
    MdListAlt,
    MdLink,
    MdWarning,
    MdOutdoorGrill,
    MdLogout,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import AdminCard from "../comonents/adminCard";
import Input from "../comonents/inputField";
import Feedback from "../comonents/toast";
import Label from "../comonents/label";
import { useAuth } from "../store/authStore";
import api from './../lib/axios';
import AdminSystemCOnfigScreen from "../comonents/adminSystemConfig";

// ─── Seed data (replace with real API calls) ──────────────────────────────────
const SEED_RECORDS = [
    { id: 1, number: 1, name: "Adebayo Olamide", stateCode: "LA/23A/1001", time: "08:21 AM" },
    { id: 2, number: 2, name: "Chioma Nwosu", stateCode: "LA/23A/0482", time: "08:24 AM" },
    { id: 3, number: 3, name: "Emeka Okafor", stateCode: "LA/23A/0734", time: "08:27 AM" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Record = { id: number; number: number; name: string; stateCode: string; time: string };



// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
    const { setAdmin, setIsAuthenticated, admin } = useAuth()
    // ── Session ──
    const [sessionOpen, setSessionOpen] = useState(false);
    const [lga, setLga] = useState("");
    const [cdsGroup, setCdsGroup] = useState("");
    const [sessionLga, setSessionLga] = useState("");
    const [sessionCds, setSessionCds] = useState("");

    // ── Attendance ──
    const [records, setRecords] = useState<Record[]>([]);

    // ── Manual assignment ──
    const [manualName, setManualName] = useState("");
    const [manualCode, setManualCode] = useState("");
    const [assignMsg, setAssignMsg] = useState("");

    // ── System config ──


    const navigate = useNavigate()

    useEffect(() => {
        console.log(admin);
    }, [admin])

    // ── Handlers ──
    const openSession = () => {
        if (!lga.trim() || !cdsGroup.trim()) return;
        setSessionLga(lga);
        setSessionCds(cdsGroup);
        setSessionOpen(true);
        setRecords(SEED_RECORDS); // seed for preview; remove in prod
    };

    const closeSession = () => {
        setSessionOpen(false);
        setRecords([]);
    };

    const assignManual = () => {
        if (!manualName.trim() || !manualCode.trim()) return;
        const next = records.length + 1;
        const now = new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
        setRecords((prev) => [
            ...prev,
            { id: Date.now(), number: next, name: manualName, stateCode: manualCode, time: now },
        ]);
        setAssignMsg(`Assigned #${String(next).padStart(3, "0")} to ${manualName}`);
        setManualName("");
        setManualCode("");
        setTimeout(() => setAssignMsg(""), 5000);
    };


    const handleLogOut = async () => {
        const res = await api.get('/auth/logout');
        if (res.data.success) {
            setAdmin(null)
            setIsAuthenticated(false)
            navigate('/admin-login')
        }
    }



    return (
        // <div className="min-h-screen bg-[#F4F6FA] font-sans">





        <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">

            {/* ─── 1. Session Control ─────────────────────────────── */}
            <AdminCard
                icon={<MdLockOpen className="text-lg" />}
                title="Session Control"
                subtitle="Open a session to allow corper check-ins. Close it when attendance ends."
                badge={
                    sessionOpen ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#2b7234] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#25eb2f] animate-pulse" />
                            Open
                        </span>
                    ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
                            Closed
                        </span>
                    )
                }
            >
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <Label>LGA</Label>
                        <Input
                            placeholder="e.g. Eti-Osa"
                            value={lga}
                            onChange={(e) => setLga(e.target.value)}
                            disabled={sessionOpen}
                        />
                    </div>
                    <div>
                        <Label>CDS Group</Label>
                        <Input
                            placeholder="e.g. Tech Hub 3"
                            value={cdsGroup}
                            onChange={(e) => setCdsGroup(e.target.value)}
                            disabled={sessionOpen}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={openSession}
                        disabled={sessionOpen || !lga.trim() || !cdsGroup.trim()}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2b7234] hover:bg-[#153619] text-white text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <MdLockOpen className="text-base" /> Open Session
                    </button>
                    <button
                        onClick={closeSession}
                        disabled={!sessionOpen}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <MdLock className="text-base" /> Close Session
                    </button>
                </div>
            </AdminCard>

            {/* ─── 2. Live Attendance ─────────────────────────────── */}
            <AdminCard
                icon={<MdListAlt className="text-lg" />}
                title="Live Attendance"
                subtitle="Real-time list of all corpers checked in for this session."
                badge={
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {records.length} total
                    </span>
                }
            >
                {records.length === 0 ? (
                    <div className="py-8 flex flex-col items-center gap-2 text-center">
                        <MdListAlt className="text-3xl text-slate-200" />
                        <p className="text-sm text-slate-400">No check-ins yet.</p>
                        {!sessionOpen && (
                            <p className="text-xs text-slate-300">Open a session to start.</p>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-5">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-2 pl-5 pr-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 w-14">#</th>
                                    <th className="text-left py-2 pr-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Name</th>
                                    <th className="text-left py-2 pr-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">State Code</th>
                                    <th className="text-right py-2 pr-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r) => (
                                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                                        <td className="py-3 pl-5 pr-3">
                                            <span className="font-mono font-bold text-[#2b7234] text-xs bg-[#2b7234]/8 px-2 py-0.5 rounded-md">
                                                {String(r.number).padStart(3, "0")}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-3 font-medium text-slate-800">{r.name}</td>
                                        <td className="py-3 pr-3 font-mono text-slate-500 text-xs">{r.stateCode}</td>
                                        <td className="py-3 pr-5 text-right text-slate-400 text-xs">{r.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </AdminCard>

            {/* ─── 3. Manual Assignment ───────────────────────────── */}
            <AdminCard
                icon={<MdPersonAdd className="text-lg" />}
                title="Manual Assignment"
                subtitle="Use this when a corper has a faulty device and cannot check in themselves."
            >
                {!sessionOpen && (
                    <div className="flex items-center gap-2 mb-4 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5">
                        <MdWarning className="text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-700 font-medium">Open a session first to assign numbers.</p>
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    <div>
                        <Label>Full Name</Label>
                        <Input
                            placeholder="e.g. Adebayo Olamide"
                            value={manualName}
                            onChange={(e) => setManualName(e.target.value)}
                            disabled={!sessionOpen}
                        />
                    </div>
                    <div>
                        <Label>State Code</Label>
                        <Input
                            placeholder="e.g. LA/23A/1234"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            disabled={!sessionOpen}
                        />
                    </div>
                    {assignMsg && <Feedback type="success" message={assignMsg} />}
                    <button
                        onClick={assignManual}
                        disabled={!sessionOpen || !manualName.trim() || !manualCode.trim()}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2b7234] hover:bg-[#153619] text-white text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <MdPersonAdd className="text-base" /> Assign Number
                    </button>
                </div>
            </AdminCard>

            {/* ─── 4. System Configuration ────────────────────────── */}
            {/* <AdminSystemCOnfigScreen /> */}

        </main>


        // </div>
    );
}