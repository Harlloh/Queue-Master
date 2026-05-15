import { useState } from "react";
import LiveAttendance from "./liveAttendance";
import AttendanceHistory from "./attendanceHistory";

type Tab = 'live' | 'history';

function AttendancePage() {
    const [activeTab, setActiveTab] = useState<Tab>('live');

    return (
        <div>
            {/* Tab switcher */}
            <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('live')}
                    className={`text-xs font-semibold px-4 py-1.5 rounded-md transition ${activeTab === 'live'
                        ? 'bg-white text-[#2b7234] shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Live
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`text-xs font-semibold px-4 py-1.5 rounded-md transition ${activeTab === 'history'
                        ? 'bg-white text-[#2b7234] shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    History
                </button>
            </div>

            {activeTab === 'live' ? <LiveAttendance /> : <AttendanceHistory />}
        </div>
    );
}

export default AttendancePage;