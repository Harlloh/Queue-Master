import { useState } from "react";
import {
    MdOpenInNew,
    MdLockOpen,
    MdLock,
    MdMyLocation,
    MdSave,
    MdPersonAdd,
    MdRadar,
    MdSettings,
    MdListAlt,
    MdLink,
} from "react-icons/md";

// ─── Seed data (replace with real API calls) ──────────────────────────────────
const SEED_RECORDS = [
    { id: 1, number: 1, name: "Adebayo Olamide", stateCode: "LA/23A/1001", time: "08:21 AM" },
    { id: 2, number: 2, name: "Chioma Nwosu", stateCode: "LA/23A/0482", time: "08:24 AM" },
    { id: 3, number: 3, name: "Emeka Okafor", stateCode: "LA/23A/0734", time: "08:27 AM" },
];

export default function AdminPage() {
    // ── Session state ──
    const [sessionOpen, setSessionOpen] = useState(false);
    const [lga, setLga] = useState("");
    const [cdsGroup, setCdsGroup] = useState("");
    const [sessionLga, setSessionLga] = useState("");
    const [sessionCds, setSessionCds] = useState("");

    // ── Attendance records ──
    const [records, setRecords] = useState<{ id: number; number: number; name: string; stateCode: string; time: string }[]>([]);

    // ── Manual assignment ──
    const [manualName, setManualName] = useState("");
    const [manualCode, setManualCode] = useState("");
    const [assignMsg, setAssignMsg] = useState("");

    // ── System config ──
    const [configLga, setConfigLga] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [radius, setRadius] = useState("200");
    const [configMsg, setConfigMsg] = useState("");
    const [configError, setConfigError] = useState("");

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
    };

    const assignManual = () => {
        if (!manualName.trim() || !manualCode.trim()) return;
        const next = records.length + 1;
        const now = new Date().toLocaleTimeString("en-NG", {
            hour: "2-digit",
            minute: "2-digit",
        });
        setRecords((prev: any) => [
            ...prev,
            { id: Date.now(), number: next, name: manualName, stateCode: manualCode, time: now },
        ]);
        setAssignMsg(`Assigned #${String(next).padStart(3, "0")} to ${manualName}`);
        setManualName("");
        setManualCode("");
        setTimeout(() => setAssignMsg(""), 3000);
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLat(pos.coords.latitude.toFixed(6));
                setLng(pos.coords.longitude.toFixed(6));
            },
            () => { }
        );
    };

    const saveConfig = () => {
        setConfigError("");
        const r = parseFloat(radius);
        if (!configLga.trim() || !lat || !lng) {
            setConfigError("All fields are required.");
            return;
        }
        if (r < 50 || r > 1000) {
            setConfigError("Radius must be between 50m and 1000m.");
            return;
        }
        setConfigMsg("Location settings updated successfully");
        setTimeout(() => setConfigMsg(""), 3000);
    };

    return (
        <div className="min-h-screen bg-[#F4F6FA] font-sans">
            {/* ── Top nav ── */}
            <header className="bg-[#0F1B3C] text-white px-5 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-md">
                <span className="font-bold text-base tracking-tight">CDS Admin</span>
                <a
                    href="/"
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition"
                >
                    <MdLink className="text-sm" /> Check-in page
                </a>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
                {/* ─── Session Control ─────────────────────────────────────────── */}
                <Section
                    icon={<MdLockOpen className="text-lg text-[#2563EB]" />}
                    title="Session Control"
                    badge={
                        sessionOpen ? (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                OPEN
                            </span>
                        ) : null
                    }
                >
                    {sessionOpen && (
                        <p className="text-xs text-slate-500 mb-3 font-mono">
                            {sessionLga} — {sessionCds}
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex flex-col gap-1">
                            <label className="field-label">LGA</label>
                            <input
                                className="field-input"
                                placeholder="e.g. Eti-Osa"
                                value={lga}
                                onChange={(e) => setLga(e.target.value)}
                                disabled={sessionOpen}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="field-label">CDS Group</label>
                            <input
                                className="field-input"
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
                            className="btn-primary"
                        >
                            <MdLockOpen className="text-base" /> Open Session
                        </button>
                        <button
                            onClick={closeSession}
                            disabled={!sessionOpen}
                            className="btn-danger"
                        >
                            <MdLock className="text-base" /> Close Session
                        </button>
                    </div>
                </Section>

                {/* ─── Live Attendance ─────────────────────────────────────────── */}
                <Section
                    icon={<MdListAlt className="text-lg text-[#2563EB]" />}
                    title="Live Attendance"
                    badge={
                        <span className="text-xs text-slate-500 font-medium">
                            {records.length} checked in
                        </span>
                    }
                >
                    {records.length === 0 ? (
                        <p className="text-center text-sm text-slate-400 py-6">
                            No check-ins yet
                        </p>
                    ) : (
                        <div className="overflow-x-auto -mx-5">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="table-head pl-5 w-12">#</th>
                                        <th className="table-head text-left">Name</th>
                                        <th className="table-head text-left">State Code</th>
                                        <th className="table-head pr-5 text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((r: any) => (
                                        <tr
                                            key={r.id}
                                            className="border-b border-slate-50 hover:bg-slate-50 transition"
                                        >
                                            <td className="py-3 pl-5 font-mono font-bold text-[#2563EB] text-xs">
                                                {String(r.number).padStart(3, "0")}
                                            </td>
                                            <td className="py-3 text-slate-800 font-medium">{r.name}</td>
                                            <td className="py-3 text-slate-500 font-mono text-xs">{r.stateCode}</td>
                                            <td className="py-3 pr-5 text-right text-slate-400 text-xs">{r.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Section>

                {/* ─── Manual Assignment ───────────────────────────────────────── */}
                <Section
                    icon={<MdPersonAdd className="text-lg text-[#2563EB]" />}
                    title="Manual Assignment"
                >
                    <p className="text-xs text-slate-400 mb-4">
                        Use this for corpers with faulty devices.
                    </p>
                    <div className="flex flex-col gap-3">
                        <input
                            className="field-input"
                            placeholder="Full Name"
                            value={manualName}
                            onChange={(e) => setManualName(e.target.value)}
                        />
                        <input
                            className="field-input"
                            placeholder="State Code  e.g. LA/23A/1234"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                        />
                        {assignMsg && (
                            <p className="text-xs text-emerald-600 font-medium">{assignMsg}</p>
                        )}
                        <button
                            onClick={assignManual}
                            disabled={!sessionOpen || !manualName.trim() || !manualCode.trim()}
                            className="btn-primary"
                        >
                            <MdPersonAdd className="text-base" /> Assign Number
                        </button>
                    </div>
                </Section>

                {/* ─── System Config ───────────────────────────────────────────── */}
                <Section
                    icon={<MdSettings className="text-lg text-[#2563EB]" />}
                    title="System Configuration"
                    subtitle="This location defines the allowed check-in area"
                >
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="field-label">LGA Name</label>
                            <input
                                className="field-input"
                                placeholder="e.g. Ikeja"
                                value={configLga}
                                onChange={(e) => setConfigLga(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="field-label">Latitude</label>
                                <input
                                    className="field-input"
                                    placeholder="e.g. 6.6018"
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="field-label">Longitude</label>
                                <input
                                    className="field-input"
                                    placeholder="e.g. 3.3515"
                                    value={lng}
                                    onChange={(e) => setLng(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="field-label">Radius (meters)</label>
                            <input
                                className="field-input"
                                type="number"
                                min={50}
                                max={1000}
                                value={radius}
                                onChange={(e) => setRadius(e.target.value)}
                            />
                            <p className="text-[11px] text-slate-400">Between 50m and 1000m</p>
                        </div>

                        {configError && (
                            <p className="text-xs text-rose-500 font-medium">{configError}</p>
                        )}
                        {configMsg && (
                            <p className="text-xs text-emerald-600 font-medium">{configMsg}</p>
                        )}

                        <button
                            onClick={useCurrentLocation}
                            className="w-full py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium hover:bg-slate-50 active:scale-[0.98] transition flex items-center justify-center gap-2"
                        >
                            <MdMyLocation className="text-base text-rose-500" /> Use Current Location
                        </button>
                        <button
                            onClick={saveConfig}
                            className="btn-primary"
                        >
                            <MdSave className="text-base" /> Save Settings
                        </button>
                    </div>
                </Section>
            </main>

            {/* ─── Tailwind utility classes injected via style tag ─────────────────── */}
            <style>{`
        .field-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #64748b;
        }
        .field-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          color: #1e293b;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
        }
        .field-input:disabled {
          background: #f8fafc;
          color: #94a3b8;
          cursor: not-allowed;
        }
        .btn-primary {
          width: 100%;
          padding: 11px 16px;
          border-radius: 12px;
          background: #2563eb;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.01em;
          border: none;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-primary:active { transform: scale(0.98); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

        .btn-danger {
          width: 100%;
          padding: 11px 16px;
          border-radius: 12px;
          background: #DC2626;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.01em;
          border: none;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .btn-danger:hover { background: #b91c1c; }
        .btn-danger:active { transform: scale(0.98); }
        .btn-danger:disabled { opacity: 0.45; cursor: not-allowed; }

        .table-head {
          padding: 8px 0;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
        }
      `}</style>
        </div>
    );
}

// ── Reusable card section ─────────────────────────────────────────────────────
function Section({ icon, title, subtitle, badge, children }: any) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
                {icon}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0F1B3C] text-sm">{title}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                    )}
                </div>
                {badge}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}