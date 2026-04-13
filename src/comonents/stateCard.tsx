
import { CARD_STATES } from '../lib/utils';

function StateCard({ state, onRetry }: { state: string, onRetry: () => void }) {
    const config = CARD_STATES[state];
    if (!config) return null;
    return (
        <div className="flex flex-col items-center justify-center py-14 px-6 gap-3 text-center">
            {config.showSpinner && (
                <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#2563EB] animate-spin" />
            )}

            {config.icon && config.icon}

            {config.title && (
                <p className="font-semibold text-slate-800 text-base">
                    {config.title}
                </p>
            )}

            {config.message && (
                <p className="text-sm text-slate-500 leading-relaxed">
                    {config.message}
                </p>
            )}

            {config.button && (
                <button
                    onClick={onRetry}
                    className="mt-2 text-sm font-medium text-[#2563EB] underline underline-offset-2"
                >
                    {config.button.text}
                </button>
            )}
        </div>
    );
}

export default StateCard;