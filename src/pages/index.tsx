import { useState, useEffect } from "react";
import {
    MdLocationOn,
    MdLocationOff,
    MdCheckCircle,
    MdError,
    MdLock,
    MdAccessTime,
} from "react-icons/md";
import StateCard from "../comonents/stateCard";
import { useParams } from "react-router-dom";
import api from '../lib/axios'
import type { SessionInterface } from "../lib/utils";
// ─── Possible UI states ───────────────────────────────────────────────────────
// "loading"       → fetching session info + verifying location
// "no_location"   → admin hasn't set LGA coordinates yet
// "no_session"    → no active session open
// "outside"       → corper is outside the geofence
// "form"          → ready to check in
// "already_in"    → device already checked in this session
// "success"       → just checked in successfully

// const MOCK_SESSION = {
//     lga: "Eti-Osa",
//     cdsGroup: "Tech Hub 3",
// };

export default function IndexPage() {
    const [view, setView] = useState("loading");
    const [form, setForm] = useState({ name: "", stateCode: "" });
    const [sessionInfo, setSessionInfo] = useState<SessionInterface | null>(null)
    const [queueNumber, setQueueNumber] = useState<number>(0o1);
    const [checkedInAt, setCheckedInAt] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const { sessionId } = useParams()



    const handleSubmit = () => {
        //     if (!form.name.trim() || !form.stateCode.trim()) {
        //         setError("Please fill in both fields.");
        //         return;
        //     }
        //     setError("");
        //     setSubmitting(true);
        //     setTimeout(() => {
        //         setQueueNumber(7);
        //         setCheckedInAt("10:43 AM");
        //         setSubmitting(false);
        //         setView("success");
        //     }, 1400);
    };



    const sessionLabel =
        sessionInfo ? `${sessionInfo?.lga} · ${sessionInfo?.cdsGroup}` : null;

    const handleRetry = () => {
        setView("loading");
        console.log('Retrying geolocation');
        handleLocation()
        // Add your retry logic here
    };
    const handleLocation = () => {
        if (!navigator.geolocation) {
            setView("no_location");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log({ latitude, longitude }); // ← just this for now
                setView("form"); // remove this too when real validation is wired up
                // const res = await api.get(
                //     `/api/session/${sessionId}/validate`, // ← this validates the session AND checks location
                //     { params: { lat: latitude, lng: longitude } }
                // );
            },
            (_err) => {
                setView("no_location");
            },
            { timeout: 10000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        console.log(sessionId);
        if (!sessionId) {
            setView("no_session");
            return;
        };
        if (!navigator.geolocation) {
            setView("no_location");
            return;
        }
        handleLocation()

    }, [sessionId])


    // const validateSession = async () => {
    //     const res = await api.get(`/validate-session?sessionId=${sessionId}`)
    //     if (res.status === 200) {
    //         setSessionInfo(res.data)
    //     }
    //     if (!res.data.isSessionActive) {
    //         setView('no_session')
    //     }
    // }
    // useEffect(() => {
    //     validateSession()
    // }, [])


    return (
        <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center px-4 py-10 font-sans">
            {/* ── Header ── */}
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[#0F1B3C]">
                    CDS Attendance
                </h1>
                {sessionLabel && view !== "no_location" && view !== "no_session" && (
                    <p className="text-sm text-slate-500 mt-1">{sessionLabel} sdfsd</p>
                )}
            </div>

            {/* ── Card ── */}
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Simple states - using StateCard */}
                {["loading", "no_location", "no_session", "outside"].includes(view) && (
                    <StateCard state={view} onRetry={handleRetry} />
                )}

                {/* Form */}
                {view === "form" && (
                    <div className="p-6 flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Adebayo Olamide"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] transition"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                State Code
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. LA/23A/1234"
                                value={form.stateCode}
                                onChange={(e) => setForm({ ...form, stateCode: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] transition"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-rose-500 flex items-center gap-1.5">
                                <MdError className="text-base shrink-0" /> {error}
                            </p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full py-3.5 rounded-xl bg-[#2b7234] hover:bg-[#153619] active:scale-[0.98] text-white text-sm font-semibold tracking-wide transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Assigning…
                                </>
                            ) : (
                                "Get My Number"
                            )}
                        </button>
                    </div>
                )}

                {/* Already checked in */}
                {view === "already_in" && (
                    <div className="flex flex-col items-center py-14 px-6 gap-2 text-center">
                        <p className="text-sm text-slate-500 mb-1">
                            You have already checked in
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Your Queue Number
                        </p>
                        <p className="text-[72px] font-black leading-none text-[#2563EB] tabular-nums">
                            {String(queueNumber || 1).padStart(3, "0")}
                        </p>
                        <p className="text-sm text-slate-500">Please wait for your turn</p>
                        {checkedInAt && (
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <MdAccessTime className="text-sm" /> Checked in at {checkedInAt}
                            </p>
                        )}
                    </div>
                )}

                {/* Success */}
                {view === "success" && (
                    <div className="flex flex-col items-center py-10 px-6 gap-2 text-center">
                        <MdCheckCircle className="text-3xl text-emerald-500 mb-1" />
                        <p className="text-sm font-medium text-slate-700">
                            Check-in successful!
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-3">
                            Your Queue Number
                        </p>
                        <p className="text-[80px] font-black leading-none text-[#2563EB] tabular-nums">
                            {String(queueNumber).padStart(3, "0")}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            Please wait for your turn
                        </p>
                        {checkedInAt && (
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <MdAccessTime className="text-sm" /> Checked in at {checkedInAt}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <p className="mt-8 text-xs text-slate-400 tracking-wide">
                CDS Queue System
            </p>

            {/* ── Dev state switcher (remove in prod) ── */}
            {/* <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {["loading", "no_location", "no_session", "outside", "form", "already_in", "success"].map(
                    (s) => (
                        <button
                            key={s}
                            onClick={() => {
                                if (s === "already_in") { setQueueNumber(1); setCheckedInAt("08:21 PM"); }
                                setView(s);
                            }}
                            className={`text-[10px] px-2.5 py-1 rounded-full border font-mono transition ${view === s
                                ? "bg-[#0F1B3C] text-white border-[#0F1B3C]"
                                : "text-slate-400 border-slate-200 hover:border-slate-400"
                                }`}
                        >
                            {s}
                        </button>
                    )
                )}
            </div> */}
        </div>
    );
}