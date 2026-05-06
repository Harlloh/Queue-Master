import { useState, useEffect } from "react";
import { MdCheckCircle, MdError, MdAccessTime } from "react-icons/md";
import StateCard from "../comonents/stateCard";
import { useParams } from "react-router-dom";
// import type { SessionInterface } from "../lib/utils";
import api from "../lib/axios";
import { Thumbmark } from "@thumbmarkjs/thumbmarkjs";
import toast from "react-hot-toast";
import { ACCURACY_THRESHOLD, getLocation } from "../lib/utils";

type ViewState = "loading" | "no_location_access" | "no_session" | "outside" | "error" | "form" | "success" | "already_in" | "poor_gps" | "submission_error";

export default function IndexPage() {

    const [thumbmark, setThumbmark] = useState('');

    useEffect(() => {
        const tm = new Thumbmark;
        tm.get()
            .then((result) => {
                setThumbmark(result.thumbmark);
            })
            .catch((error) => {
                console.error('Error getting fingerprint:', error);
            });
    }, []);


    const { lgaUniqueLink } = useParams();
    const [view, setView] = useState<ViewState>("loading");
    const [form, setForm] = useState({ name: "", stateCode: "" });
    const [submitting, setSubmitting] = useState(false);

    const [queueNumber, setQueueNumber] = useState<number | null>(null);
    const [checkedInAt, setCheckedInAt] = useState<string | null>(null);
    const [error, setError] = useState("");

    // const ACCURACY_THRESHOLD = 100; // metres
    // // const ACCURACY_THRESHOLD = 100; // metres
    // const TIMEOUT = 15000; // max wait time
    // const getLocation = (): Promise<{ latitude: number; longitude: number; accuracy: number } | { denied: true } | null> => {

    //     return new Promise((resolve) => {
    //         if (!navigator.geolocation) { resolve(null); return; }


    //         let watchId: number;
    //         let settled = false;

    //         const done = (result: any) => {
    //             if (settled) return;
    //             settled = true;
    //             navigator.geolocation.clearWatch(watchId);
    //             resolve(result);
    //         };

    //         // Hard timeout — don't wait forever
    //         const timer = setTimeout(() => done(null), TIMEOUT);

    //         watchId = navigator.geolocation.watchPosition(
    //             (pos) => {
    //                 const { latitude, longitude, accuracy } = pos.coords;
    //                 console.log('GPS accuracy:', accuracy);

    //                 // Accept as soon as we hit threshold
    //                 if (accuracy <= ACCURACY_THRESHOLD) {
    //                     clearTimeout(timer);
    //                     done({ latitude, longitude, accuracy });
    //                 }
    //             },
    //             (err) => {
    //                 clearTimeout(timer);
    //                 done(err.code === err.PERMISSION_DENIED ? { denied: true } : null);
    //                 // done(null);
    //             },
    //             { maximumAge: 0, enableHighAccuracy: true }
    //         );
    //     });
    // };

    const validateSession = async (): Promise<any | null> => {
        try {
            const res = await api.get('/user/validateSession', {
                params: { checkInSlug: lgaUniqueLink }
            });
            console.log(res.data);
            // setSessionInfo(res.data.session);
            return res.data;
        } catch (error: any) {
            if (!error.response) {
                setView("error"); // network error
            } else {
                setView(error.response.data.status); // actual no session
            }
            return null
        }
    };
    const validateLocation = async (location: any) => {
        try {
            const res = await api.get('/user/validateLocation', {
                params: {
                    checkInSlug: lgaUniqueLink,
                    latitude: location.latitude,
                    longitude: location.longitude,
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
        console.log(sessionData, 'This is the session data');
        if (!sessionData) {
            return;
        }
        if (!sessionData?.session.isOpen) {
            setView("no_session")
            return
        }

        if (!location) {
            setView("poor_gps"); // timeout — show retry
            return;
        }

        if ('denied' in location) {
            setView("no_location_access"); // permission denied — tell them to fix settings, no retry button
            return;
        }

        if (location.accuracy > ACCURACY_THRESHOLD) {
            setView('poor_gps');
            return;
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
        console.log(thumbmark);
        if (!form.name.trim() || !form.stateCode.trim()) {
            setError("Please fill in both fields.");
            return;
        }
        if (!thumbmark) {
            toast.error('Unique identifier has not been generated yet')
            return
        };

        setError("");
        setSubmitting(true);
        try {
            // TODO: send fingerprint here too
            const res = await api.post('/user/getNumber', {
                checkInSlug: lgaUniqueLink,
                name: form.name,
                stateCode: form.stateCode,
                browserId: thumbmark,
            });
            setQueueNumber(res.data.queueNumber);
            setCheckedInAt(res.data.checkedInAt);
            setView(res.data.status);
        } catch (err: any) {
            if (err?.response.data.status) {
                setView(err.response.data.status);
            } else {
                setView('submission_error')
            }
            setError(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    // const sessionLabel = sessionInfo ? `${sessionInfo.lga} · ${sessionInfo.cdsGroup}` : null;

    return (
        <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center px-4 py-10 font-sans">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[#0F1B3C]">CDS Attendance</h1>
                {/* {sessionLabel && !["no_session", "no_location_access"].includes(view) && (
                    <p className="text-sm text-slate-500 mt-1">{sessionLabel}</p>
                )} */}
            </div>

            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {["loading", "no_location_access", "no_session", "outside", "poor_gps", 'error', 'submission_error'].includes(view) && (
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