// components/TabBarItem.tsx
import { NavLink } from "react-router-dom";

type Props = {
    to: string;
    label: string;
    icon: React.ReactNode;
    end?: boolean;
};

function TabBarItem({ to, label, icon, end }: Props) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold tracking-wide transition relative
                ${isActive
                    ? "text-[#2b7234] before:absolute before:top-0 before:left-[20%] before:right-[20%] before:h-[2px] before:bg-[#2b7234] before:rounded-b-sm"
                    : "text-slate-400"
                }`
            }
        >
            <span className="text-base">{icon}</span>
            {label}
        </NavLink>
    );
}

export default TabBarItem;