import { useState, useEffect } from "react";
import {
    MdCheckCircle,
    MdError,
    MdAccessTime,
} from "react-icons/md";
import StateCard from "../comonents/stateCard";
import { useParams } from "react-router-dom";
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
type stateType = "loading" | "no_location" | "no_session" | "outside" | "no_location_access" | "requesting_location_access" | "form" | "success" | "already_in"
export default function IndexPage() {
    const [view, setView] = useState<stateType>("loading");
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

    const handleRetry = async () => {
        console.log('Retrying...');

        // Start getting location immediately
        const location = await getLocation();

        if (!location) {
            // Location failed, view already set by getLocation()
            return;
        }

        // Validate the location
        await validateLocation(location.latitude, location.longitude);
    };
    const validateLocation = async (latitude: number, longitude: number) => {
        setView("loading");

        // Simulate location validation delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Later replace with actual API call:
        // const res = await api.get(
        //     `/api/session/${sessionId}/validate-location`,
        //     { params: { lat: latitude, lng: longitude } }
        // );

        // if (res.data.withinGeofence) {
        //     setView("form");
        // } else {
        //     setView("outside");
        // }

        setView("form");
    };
    const getLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
        if (!navigator.geolocation) {
            setView("no_location_access");
            return null;
        }

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    { maximumAge: 0, enableHighAccuracy: true }
                );
            });

            return {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
        } catch (error: any) {
            console.error('Location error:', error);

            if (error.code === 1) {
                console.log('User denied location permission');
            } else if (error.code === 3) {
                console.log('Location request timed out');
            }

            setView("no_location_access");
            return null;
        }
    };

    useEffect(() => {
        const init = async () => {
            console.log(sessionId, 'sessionid');

            if (!sessionId || sessionId === 'no_session') {
                setView("no_session");
                return;
            }

            setView("loading");

            // Start getting location immediately (runs in background)
            const locationPromise = getLocation();

            // Validate session
            try {
                // Simulate session validation
                await new Promise(resolve => setTimeout(resolve, 300));

                // const sessionRes = await api.get(`/api/session/${sessionId}/validate-session`);

                // if (!sessionRes.data.isActive) {
                //     setView("no_session");
                //     return;
                // }

                // Session is valid, now wait for location to be ready
                const location = await locationPromise;

                if (!location) {
                    // Location failed, view already set by getLocation()
                    return;
                }

                // Session is valid and we have location, now validate location
                await validateLocation(location.latitude, location.longitude);

            } catch (error) {
                console.error('Session validation failed:', error);
                setView("no_session");
            }
        };

        init();
    }, [sessionId]);


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
                {["loading", "no_location", "no_session", "outside", "no_location_access", "requesting_location_access"].includes(view) && (
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