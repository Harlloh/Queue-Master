import { MdHistory, MdFileUpload } from "react-icons/md";
import AdminCard from "./adminCard";
import { useEffect, useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";

type SessionSummary = {
    id: string;
    date: string;
    openedAt: string | null;
    closedAt: string | null;
    totalCheckIns: number;
};

function AttendanceHistory() {
    const [sessions, setSessions] = useState<SessionSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [exportingId, setExportingId] = useState<string | null>(null);
    const [metaData, setMetaData] = useState({
        pageIndex: 1,
        pageSize: 10,
        hasMore: false,
        totalCount: 0,
    });

    // const hasFetched = useRef(false);

    useEffect(() => {
        fetchSessions();
    }, [metaData.pageIndex, metaData.pageSize]);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/sessions', {
                params: {
                    pageIndex: metaData.pageIndex,
                    pageSize: metaData.pageSize,
                },
            });
            setSessions(res.data.sessionList);
            setMetaData(prev => ({
                ...prev,
                hasMore: res.data.hasMore,
                totalCount: res.data.totalCount,
            }));
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to load session history');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (session: SessionSummary) => {
        if (exportingId) return;
        setExportingId(session.id);
        try {
            const res = await api.get(`/admin/sessions/${session.id}/export`, {
                responseType: 'blob',
            });
            const dateStr = new Date(session.date).toISOString().split('T')[0];
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `CDS_Attendance_${dateStr}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch {
            toast.error('Export failed. Please try again.');
        } finally {
            setExportingId(null);
        }
    };

    const handlePrev = () => {
        if (metaData.pageIndex > 1)
            setMetaData(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
    };

    const handleNext = () => {
        if (metaData.hasMore)
            setMetaData(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMetaData(prev => ({ ...prev, pageSize: parseInt(e.target.value), pageIndex: 1 }));
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-NG', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    return (
        <AdminCard
            icon={<MdHistory className="text-lg" />}
            title="Session History"
            subtitle="All past CDS sessions. Export any session as an Excel file."
            badge={
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {metaData.totalCount} sessions
                </span>
            }
        >
            {loading ? (
                <div className="py-8 flex justify-center text-sm text-slate-400">Loading...</div>
            ) : sessions?.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-2 text-center">
                    <MdHistory className="text-3xl text-slate-200" />
                    <p className="text-sm text-slate-400">No past sessions found.</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto -mx-5">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-2 pl-5 pr-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                                    <th className="text-left py-2 pr-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Check-ins</th>
                                    <th className="text-right py-2 pr-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Export</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions?.map(s => (
                                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                                        <td className="py-3 pl-5 pr-3 font-medium text-slate-700">
                                            {formatDate(s.date)}
                                        </td>
                                        <td className="py-3 pr-3">
                                            <span className="font-mono font-bold text-[#2b7234] text-sm bg-[#2b7234]/8 px-2 py-0.5 rounded-md">
                                                {s.totalCheckIns}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-5 text-right">
                                            <button
                                                onClick={() => handleExport(s)}
                                                disabled={!!exportingId || s.totalCheckIns === 0}
                                                title={s.totalCheckIns === 0 ? 'No attendance data to export' : ''}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                            >
                                                <MdFileUpload className="text-base" />
                                                {exportingId === s.id ? 'Exporting...' : 'Export'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between mt-4 px-1">
                        <select
                            className="p-2 bg-gray-100 text-xs font-mono"
                            value={metaData.pageSize}
                            onChange={handlePageSizeChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span className="text-xs text-slate-400">
                            Page {metaData.pageIndex}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={metaData.pageIndex === 1}
                                className="text-xs px-3 py-1 rounded-md border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition"
                            >
                                Prev
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!metaData.hasMore}
                                className="text-xs px-3 py-1 rounded-md border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </AdminCard>
    );
}

export default AttendanceHistory;