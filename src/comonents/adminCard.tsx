function AdminCard({
    icon,
    title,
    subtitle,
    badge,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    badge?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#153619]/8 text-[#2b7234]">
                    {icon}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#153619] text-sm">{title}</p>
                    {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                {badge}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

export default AdminCard;