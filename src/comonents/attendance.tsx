import { MdListAlt, MdLock } from "react-icons/md";
import AdminCard from "./adminCard";
import { useAuth } from "../store/authStore";
import { useEffect, useRef, useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

type Record = {
    id: string;
    queueNumber: number;
    name: string;
    stateCode: string;
    timestamp: string;
};

function AttendancePage() {
    const { session } = useAuth()
    const [records, setRecords] = useState<Record[]>([]);
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [metaData, setMetaData] = useState({
        pageIndex: 1,
        pageSize: 10,
        hasMore: false,
        totalCount: 0
    })
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            fetchAttendanceList()
            return
        }

        if (!searchText.trim()) {
            fetchAttendanceList()
            return
        }

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            searchAttendance()
        }, 700)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [searchText, metaData.pageIndex, metaData.pageSize])

    const fetchAttendanceList = async () => {
        setLoading(true)
        try {
            const res = await api.get(`/admin/attendanceList`, {
                params: {
                    pageIndex: metaData.pageIndex,
                    pageSize: metaData.pageSize,
                    sessionId: session?.id
                }
            });
            setRecords(res.data.attendanceList)
            setMetaData(prev => ({
                ...prev,
                hasMore: res.data.hasMore,
                totalCount: res.data.totalCount
            }))
        } catch (error: any) {
            console.log('error from fetching attendance list', error);
            toast.error(error?.response?.data?.message || 'Error fetching attendance list')
        } finally {
            setLoading(false)
        }
    }

    const searchAttendance = async () => {
        setIsSearching(true)
        try {
            const res = await api.get(`/admin/attendanceList/search`, {
                params: {
                    sessionId: session?.id,
                    query: searchText.trim()
                }
            })
            setRecords(res.data.results)
        } catch (error: any) {
            console.log('error from searching attendance list', error);
            toast.error(error?.response?.data?.message || 'Search failed')
        } finally {
            setIsSearching(false)
        }
    }

    const handlePrev = () => {
        if (metaData.pageIndex > 1)
            setMetaData(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))
    }

    const handleNext = () => {
        if (metaData.hasMore)
            setMetaData(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))
    }

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMetaData(prev => ({ ...prev, pageSize: parseInt(e.target.value), pageIndex: 1 }))
    }

    const displayRecords = records

    return (
        <>
            <AdminCard
                icon={<MdListAlt className="text-lg" />}
                title="Live Attendance"
                subtitle="Real-time list of all corpers checked in for this session."
                badge={
                    session?.isOpen ? (
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                            {metaData.totalCount} total
                        </span>
                    ) : undefined
                }
            >
                {/* Search */}
                {/* Search + Refresh */}
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        value={searchText}
                        disabled={!session?.isOpen}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder="Search by name or state code..."
                        className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-slate-400 transition"
                    />
                    <button
                        onClick={fetchAttendanceList}
                        disabled={loading || !session?.isOpen}
                        className="text-xs px-3 py-2 rounded-md border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {!session?.isOpen ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                        <MdLock className="text-4xl text-slate-200" />

                        <h3 className="text-sm font-semibold text-slate-600">
                            No active session
                        </h3>

                        <p className="text-xs text-slate-400 max-w-xs">
                            You need to open a session before check-ins can be recorded or viewed.
                        </p>

                        <Link
                            to={'/admin'}
                            className="mt-2 text-xs font-semibold text-white bg-[#2b7234] px-4 py-2 rounded-lg hover:bg-[#245c2b] transition"
                        >
                            Open Session
                        </Link>
                    </div>
                ) :
                    loading || isSearching ? (
                        <div className="py-8 flex justify-center text-sm text-slate-400">Loading...</div>
                    ) : displayRecords?.length === 0 ? (
                        <div className="py-8 flex flex-col items-center gap-2 text-center">
                            <MdListAlt className="text-3xl text-slate-200" />
                            <p className="text-sm text-slate-400">
                                {searchText ? 'No results found.' : 'No check-ins yet.'}
                            </p>
                            {!searchText && !session?.isOpen && (
                                <p className="text-xs text-slate-300">Open a session to start.</p>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto -mx-5">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="text-left py-2 pl-5 pr-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 w-14">#</th>
                                            <th className="text-left py-2 pr-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Name</th>
                                            <th className="text-left py-2 pr-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">State Code</th>
                                            <th className="text-right py-2 pr-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayRecords?.map((r) => (
                                            <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                                                <td className="py-3 pl-5 pr-6">
                                                    <span className="font-mono font-bold text-[#2b7234] text-sm bg-[#2b7234]/8 px-2 py-0.5 rounded-md">
                                                        {String(r.queueNumber).padStart(3, "0")}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-3 font-medium text-slate-800">{r.name}</td>
                                                <td className="py-3 pr-3 font-mono text-slate-500 text-xs">{r.stateCode}</td>
                                                <td className="py-3 pr-5 text-right text-slate-400 text-xs">
                                                    {new Date(r.timestamp).toLocaleTimeString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination — hide when searching */}
                            {!searchText && (
                                <div className="flex items-center justify-between mt-4 px-1">
                                    <select
                                        name="pageSize"
                                        className="p-2 bg-gray-100 text-xs font-mono"
                                        value={metaData.pageSize}
                                        onChange={handlePageSizeChange}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="40">40</option>
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
                            )}
                        </>
                    )}
            </AdminCard>
        </>
    );
}

export default AttendancePage;