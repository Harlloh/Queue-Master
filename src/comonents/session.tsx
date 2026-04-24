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


    const [manualName, setManualName] = useState("");
    const [manualCode, setManualCode] = useState("");
    const [assignMsg, setAssignMsg] = useState("");
    const [loading, setLoading] = useState({ open: false, close: false, assign: false });


    useEffect(() => {
        if (admin && !admin?.lgaDetails) {
            toast.error("Please update your LGA's details.")
            navigate('/admin/settings')
        }
    }, [admin])

    const openSession = async () => {
        console.log(!session?.isOpen);
        setLoading(prev => ({ ...prev, open: true }));

        try {
            const res = await api.post('/admin/open-session', { sessionId: session?.id })
            if (res.data.success) {
                setSession(res.data.session);
                toast.success('Session opened successfully');
            }

        } catch (error: any) {
            const message = error?.response?.data?.message;
            const session = error?.response?.data?.session;

            if (message === 'You already have an open session' && session) {
                setSession(session);
                toast.error('You already have an open session');
                return;
            }
            toast.error(error?.response.data.message)
            console.log('Something went wrong openiing session', error?.response.data.message);
        } finally {
            setLoading(prev => ({ ...prev, open: false }));
        }
    };

    const closeSession = async () => {
        setLoading(prev => ({ ...prev, close: true }));

        try {
            const res = await api.post('/admin/close-session', { sessionId: session?.id });


            if (!res.data.success) {
                toast.error(res?.data.message)

            }
            setSession(res.data.session)
        }
        catch (error: any) {
            const message = error?.response?.data?.message;
            const session = error?.response?.data?.session;

            if (message === 'Session is closed already' && session) {
                setSession(session);
                toast.error('Session was already closed.');
                return;
            }
            toast.error(message || 'Error closing session, please try again')
            console.log('Something went wrong closing session', error?.response.data.message);
        }
        finally {
            setLoading(prev => ({ ...prev, close: false }));
        }
        // setRecords([]);
    };


    const assignManual = async () => {
        if (!manualName.trim() || !manualCode.trim()) return;

        const payload = {
            name: manualName,
            stateCode: manualCode,
            sessionId: session?.id
        }
        setLoading(prev => ({ ...prev, assing: true }));

        try {
            const res = await api.post('/admin/assign-number', payload)
            console.log(res.data);
            if (!res.data.success) {
                toast.error(res.data.message || 'error assigning a number manually.')
            }
            setManualCode('')
            setManualName('')
            toast.success(res.data.message)
            setAssignMsg(`Queue number: ${res.data.attendance.queueNumber}`)
        } catch (error: any) {
            toast.error(error?.response.data.message || 'Error assigning number, please try again')
            console.log('Something went wrong closing session', error?.response.data.message);
        } finally {
            setLoading(prev => ({ ...prev, assign: false }));
        }
    };
    return (
        <>
            <AdminCard
                icon={<MdLockOpen className="text-lg" />}
                title="Session Control"
                subtitle="Open a session to allow corper check-ins. Close it when attendance ends."
                badge={
                    session?.isOpen ? (
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
                        disabled={session?.isOpen || loading.open}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2b7234] hover:bg-[#153619] text-white text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <MdLockOpen className="text-base" /> {loading.open ? 'Opening...' : 'Open Session'}
                    </button>
                    <button
                        onClick={closeSession}
                        disabled={!session?.isOpen || loading.close}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <MdLock className="text-base" /> {loading.close ? 'Closing...' : 'Close Session'}
                    </button>
                </div>
            </AdminCard>
            <div className="mt-9">

                <AdminCard
                    icon={<MdPersonAdd className="text-lg" />}
                    title="Manual Assignment"
                    subtitle="Use this when a corper has a faulty device and cannot check in themselves."

                >
                    {!session?.isOpen && (
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
                                disabled={!session?.isOpen}
                            />
                        </div>
                        <div>
                            <Label>State Code</Label>
                            <Input
                                placeholder="e.g. LA/23A/1234"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                disabled={!session?.isOpen}
                            />
                        </div>
                        {(assignMsg && session?.isOpen) && <Feedback type="success" message={assignMsg} />}
                        <button
                            onClick={assignManual}
                            disabled={!session?.isOpen || !manualName.trim() || !manualCode.trim() || loading.assign}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2b7234] hover:bg-[#153619] text-white text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <MdPersonAdd className="text-base" />     {loading.assign ? 'Assigning...' : 'Assign Number'}
                        </button>
                    </div>
                </AdminCard>
            </div>
        </>
    );
}

export default SessionPage;