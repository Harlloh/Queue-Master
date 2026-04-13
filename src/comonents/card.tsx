


function Card({ icon, title, subtitle, badge, children }: { icon: React.ReactNode, title: string, subtitle: string, badge: React.ReactNode, children: string }) {
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

export default Card;