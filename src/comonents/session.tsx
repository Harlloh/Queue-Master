import { MdLock, MdLockOpen, MdPersonAdd, MdWarning } from "react-icons/md";
import AdminCard from "./adminCard";
import { useAuth } from "../store/authStore";
import Input from "./inputField";
import Label from "./label";
import { useEffect, useState } from "react";
import Feedback from "./toast";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";

function SessionPage() {
    const { session, admin, setSession } = useAuth()
    const navigate = useNavigate()


    const sessionOpen = session?.sessionOpen;





    const [manualName, setManualName] = useState("");
    const [manualCode, setManualCode] = useState("");
    const [assignMsg, setAssignMsg] = useState("");


    useEffect(() => {
        if (!admin?.lgaDetails) {
            toast.error("Please update your LGA's details.")
            navigate('/admin/settings')
        }
    }, [])

    const openSession = async () => {
        // setSessionLga(lga);
        // setSessionCds(cdsGroup);
        console.log(!sessionOpen);
        try {
            const res = await api.post('/admin/open-session', { sessionOpen: !sessionOpen })
            if (res.data.success) {
                setSession(res.data.session);
                toast.success('Session opened successfully');
            }
        } catch (error: any) {
            toast.error(error.message)
            console.log('Something went wrong openiing session', error.message);
        }
    };

    const closeSession = () => {
        setSession(null);
        console.log(!sessionOpen);
        // setRecords([]);
    };


    const assignManual = () => {
        if (!manualName.trim() || !manualCode.trim()) return;
        // const next = records.length + 1;
        // const now = new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
        // setRecords((prev) => [
        //     ...prev,
        //     { id: Date.now(), number: next, name: manualName, stateCode: manualCode, time: now },
        // ]);
        // setAssignMsg(`Assigned #${String(next).padStart(3, "0")} to ${manualName}`);
        // setManualName("");
        // setManualCode("");
        // setTimeout(() => setAssignMsg(""), 5000);
    };
    return (
        <>
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

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={openSession}
                        disabled={sessionOpen}
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
            <div className="mt-9">

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
            </div>
        </>
    );
}

export default SessionPage;