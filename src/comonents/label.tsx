function Label({ children }: { children: React.ReactNode }) {
    return (
        <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            {children}
        </label>
    );
}

export default Label