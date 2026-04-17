import { useState } from "react";
import { MdLock, MdVisibility, MdVisibilityOff, MdError } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";

type LoginState = "idle" | "loading" | "error";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<LoginState>("idle");
    const [errorMsg, setErrorMsg] = useState("invalid email or password");
    const navigate = useNavigate();

    const { login } = useAuth()

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setErrorMsg("Both fields are required.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        try {
            const loggedIn = await login(email, password);

            if (!loggedIn.success) {
                setStatus('error');
                setErrorMsg(loggedIn.error || 'Something went wrong');
                return;
            }

            navigate("/admin-dashboard");
        } catch (err: any) {
            const msg = err.response?.data?.message;
            setErrorMsg(msg ?? "Invalid credentials. Try again.");
            setStatus("error");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="min-h-screen flex font-sans">

            {/* ── Left panel — brand ─────────────────────────────────── */}
            <div className="hidden lg:flex flex-col justify-between w-[42%] bg-[#153619] px-12 py-12 relative overflow-hidden">

                {/* Geometric background texture */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            0deg, transparent, transparent 40px,
                            #fff 40px, #fff 41px
                        ), repeating-linear-gradient(
                            90deg, transparent, transparent 40px,
                            #fff 40px, #fff 41px
                        )`
                    }}
                />
                {/* Logo mark */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#2b7234] flex items-center justify-center">
                            <MdLock className="text-white text-lg" />
                        </div>
                        <span className="text-white font-bold text-sm tracking-widest uppercase">
                            CDS Admin
                        </span>
                    </div>
                </div>

                {/* Centre copy */}
                <div className="relative z-10">
                    <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#25eb2f] mb-4">
                        Eti-Osa III LGA · NYSC
                    </p>
                    <h1 className="text-4xl font-black text-white leading-tight mb-4">
                        Attendance<br />Control Panel
                    </h1>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
                        Manage CDS sessions, monitor check-ins in real time, and control corper queue assignment.
                    </p>
                </div>

                {/* Bottom note */}
                <div className="relative z-10">
                    <p className="text-slate-600 text-xs">
                        Internal use only · CDS Queue System
                    </p>
                </div>
            </div>

            {/* ── Right panel — form ─────────────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-[#F4F6FA]">

                {/* Mobile logo (hidden on large screens) */}
                <div className="lg:hidden flex items-center gap-2.5 mb-10">
                    <div className="w-8 h-8 rounded-lg bg-[#2b7234] flex items-center justify-center">
                        <MdLock className="text-white text-sm" />
                    </div>
                    <span className="font-bold text-[#2b7234] tracking-wide text-sm">
                        CDS Admin
                    </span>
                </div>

                <div className="w-full max-w-sm">
                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-[#2b7234] tracking-tight">
                            Sign in
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Enter your admin credentials to continue.
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                        {/* Error message */}
                        {status === "error" && errorMsg && (
                            <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
                                <MdError className="text-rose-500 text-base shrink-0" />
                                <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
                            </div>
                        )}
                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                Email address
                            </label>
                            <input
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (status === "error") setStatus("idle");
                                }}
                                onKeyDown={handleKeyDown}
                                autoComplete="email"
                                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder:text-slate-300 outline-none transition
                                    ${status === "error"
                                        ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                        : "border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                                    }`}
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (status === "error") setStatus("idle");
                                    }}
                                    onKeyDown={handleKeyDown}
                                    autoComplete="current-password"
                                    className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm text-slate-800 placeholder:text-slate-300 outline-none transition
                                        ${status === "error"
                                            ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                            : "border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                    tabIndex={-1}
                                >
                                    {showPassword
                                        ? <MdVisibilityOff className="text-lg" />
                                        : <MdVisibility className="text-lg" />
                                    }
                                </button>
                            </div>
                        </div>



                        {/* Submit */}
                        <button
                            onClick={handleLogin}
                            disabled={status === "loading"}
                            className="w-full mt-1 py-3.5 rounded-xl bg-[#2b7234] hover:bg-[#153619] active:scale-[0.98] text-white text-sm font-bold tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {status === "loading" ? (
                                <>
                                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-6">
                        CDS Queue System · Internal use only
                    </p>
                </div>
            </div>
        </div>
    );
}