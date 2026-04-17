import { MdCheckCircle, MdWarning } from "react-icons/md";

function Feedback({ type, message }: { type: "success" | "error"; message: string }) {
    if (!message) return null;
    const isSuccess = type === "success";
    return (
        <div
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium
        ${isSuccess
                    ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
                    : "bg-rose-50 border border-rose-100 text-rose-600"
                }`}
        >
            {isSuccess ? (
                <MdCheckCircle className="text-emerald-500 shrink-0 text-base" />
            ) : (
                <MdWarning className="text-rose-500 shrink-0 text-base" />
            )}
            {message}
        </div>
    );
}

export default Feedback