import { useState, useEffect } from "react";
import { MdCheckCircle, MdError, MdAccessTime } from "react-icons/md";
import StateCard from "../comonents/stateCard";
import { useParams } from "react-router-dom";
import type { SessionInterface } from "../lib/utils";
import api from "../lib/axios";

type ViewState = "loading" | "no_location_access" | "no_session" | "outside" | "form" | "success" | "already_in" | "poor_gps";

export default function IndexPage() {
    const { lgaUniqueLink } = useParams();
    // const [location, setLocation] = useState({
    //     longitude: ''
    // })

    const [view, setView] = useState<ViewState>("loading");
    const [form, setForm] = useState({ name: "", stateCode: "" });
    const [submitting, setSubmitting] = useState(false);
    const [sessionInfo, setSessionInfo] = useState<SessionInterface | null>(null);
    const [queueNumber, setQueueNumber] = useState<number | null>(null);
    const [checkedInAt, setCheckedInAt] = useState<string | null>(null);
    const [error, setError] = useState("");

    const getLocation = (): Promise<{ latitude: number; longitude: number; accuracy: number } | null> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(null);
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy }),
                () => resolve(null),
                { maximumAge: 0, enableHighAccuracy: true }
            );
        });
    };

    const validateSession = async (): Promise<{ withinRadius: boolean } | null> => {
        try {
            const res = await api.get('/user/validateSession', {
                params: { checkInSlug: lgaUniqueLink }
            });
            // setSessionInfo(res.data.session);
            return res.data;
        } catch {
            return null;
        }
    };
    const validateLocation = async (location: any) => {
        try {
            const res = await api.get('/user/validateLocation', {
                params: {
                    checkInSlug: lgaUniqueLink,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    accuracy: location.accuracy
                }
            });

            setView(res.data.withinRadius ? "form" : "outside");
        } catch {
            setView("outside");
        }
    }

    const init = async () => {
        setView("loading");

        const [sessionData, location] = await Promise.all([
            validateSession(),
            getLocation(),
        ]);


        if (!sessionData) {
            setView("no_session");
            return;
        }

        if (!location) {
            setView("no_location_access");
            return;
        }
        if (location.accuracy > 100) {
            setView('poor_gps')
            return
        }

        // geofence check — backend already knows the LGA coords, just send corper coords
        console.log(location, 'Location...')
        await validateLocation(location)
    };

    useEffect(() => {
        if (!lgaUniqueLink) {
            setView("no_session");
            return;
        }
        init();
    }, [lgaUniqueLink]);

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.stateCode.trim()) {
            setError("Please fill in both fields.");
            return;
        }
        setError("");
        setSubmitting(true);
        try {
            // TODO: send fingerprint here too
            const res = await api.post('/user/checkin', {
                checkInSlug: lgaUniqueLink,
                name: form.name,
                stateCode: form.stateCode,
            });
            setQueueNumber(res.data.queueNumber);
            setCheckedInAt(res.data.checkedInAt);
            setView("success");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const sessionLabel = sessionInfo ? `${sessionInfo.lga} · ${sessionInfo.cdsGroup}` : null;

    return (
        <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center px-4 py-10 font-sans">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[#0F1B3C]">CDS Attendance</h1>
                {sessionLabel && !["no_session", "no_location_access"].includes(view) && (
                    <p className="text-sm text-slate-500 mt-1">{sessionLabel}</p>
                )}
            </div>

            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {["loading", "no_location_access", "no_session", "outside"].includes(view) && (
                    <StateCard state={view} onRetry={init} />
                )}

                {view === "form" && (
                    <div className="p-6 flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Adebayo Olamide"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] transition"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">State Code</label>
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
                                <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Assigning…</>
                            ) : "Get My Number"}
                        </button>
                    </div>
                )}

                {(view === "success" || view === "already_in") && queueNumber !== null && (
                    <div className="flex flex-col items-center py-10 px-6 gap-2 text-center">
                        {view === "success" && <MdCheckCircle className="text-3xl text-emerald-500 mb-1" />}
                        <p className="text-sm font-medium text-slate-700">
                            {view === "success" ? "Check-in successful!" : "You have already checked in"}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-3">Your Queue Number</p>
                        <p className="text-[80px] font-black leading-none text-[#2563EB] tabular-nums">
                            {String(queueNumber).padStart(3, "0")}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">Please wait for your turn</p>
                        {checkedInAt && (
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <MdAccessTime className="text-sm" /> Checked in at {checkedInAt}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <p className="mt-8 text-xs text-slate-400 tracking-wide">CDS Queue System</p>
        </div>
    );
}