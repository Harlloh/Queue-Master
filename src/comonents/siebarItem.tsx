// components/SidebarItem.tsx
import { NavLink } from "react-router-dom";

type Props = {
    to: string;
    label: string;
    icon: React.ReactNode;
    end?: boolean;
};

function SidebarItem({ to, label, icon, end }: Props) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition relative
                ${isActive
                    ? "text-[#2b7234] bg-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#2b7234] before:rounded-r-sm"
                    : "text-slate-500 hover:bg-white hover:text-slate-700"
                }`
            }
        >
            <span className="text-base">{icon}</span>
            {label}
        </NavLink>
    );
}

export default SidebarItem;