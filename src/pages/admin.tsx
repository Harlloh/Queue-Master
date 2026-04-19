import { useEffect, useState } from "react";
import {

    MdPersonAdd,
    MdListAlt,
    MdLink,
    MdWarning,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import AdminCard from "../comonents/adminCard";
import Input from "../comonents/inputField";
import Feedback from "../comonents/toast";
import Label from "../comonents/label";
import { useAuth } from "../store/authStore";
import api from './../lib/axios';

// ─── Seed data (replace with real API calls) ──────────────────────────────────
const SEED_RECORDS = [
    { id: 1, number: 1, name: "Adebayo Olamide", stateCode: "LA/23A/1001", time: "08:21 AM" },
    { id: 2, number: 2, name: "Chioma Nwosu", stateCode: "LA/23A/0482", time: "08:24 AM" },
    { id: 3, number: 3, name: "Emeka Okafor", stateCode: "LA/23A/0734", time: "08:27 AM" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Record = { id: number; number: number; name: string; stateCode: string; time: string };



// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
    const { setAdmin, setIsAuthenticated, admin } = useAuth()
    // ── Session ──


    // ── Attendance ──
    const [records, setRecords] = useState<Record[]>([]);

    // ── Manual assignment ──
    const [manualName, setManualName] = useState("");
    const [manualCode, setManualCode] = useState("");
    const [assignMsg, setAssignMsg] = useState("");

    // ── System config ──


    const navigate = useNavigate()

    useEffect(() => {
        console.log(admin);
    }, [admin])

    // ── Handlers ──








    return (
        // <div className="min-h-screen bg-[#F4F6FA] font-sans">





        <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">

            {/* ─── 1. Session Control ─────────────────────────────── */}


            {/* ─── 2. Live Attendance ─────────────────────────────── */}


            {/* ─── 3. Manual Assignment ───────────────────────────── */}


            {/* ─── 4. System Configuration ────────────────────────── */}
            {/* <AdminSystemCOnfigScreen /> */}

        </main>


        // </div>
    );
}