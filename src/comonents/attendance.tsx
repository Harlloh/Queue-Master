import { MdListAlt } from "react-icons/md";
import AdminCard from "./adminCard";
import { useAuth } from "../store/authStore";
import { useState } from "react";
type Record = { id: number; number: number; name: string; stateCode: string; time: string };

function AttendancePage() {
    const { session } = useAuth()
    const [records, setRecords] = useState<Record[]>([]);

    return (
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
                    {!session?.sessionOpen && (
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
    );
}

export default AttendancePage;