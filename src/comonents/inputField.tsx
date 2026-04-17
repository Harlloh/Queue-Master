function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800
        placeholder:text-slate-300 outline-none transition
        focus:border-[#2b7234] focus:ring-2 focus:ring-[#2b7234]/10
        disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
        ${props.className ?? ""}`}
        />
    );
}

export default Input