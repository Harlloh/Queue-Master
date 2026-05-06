import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "../store/authStore";

function QRCode() {
    const { admin } = useAuth();

    const checkInUrl = `${window.location.origin}/${admin?.lgaDetails?.checkInSlug}`

    // Add this inside your settings component, get the url from lgaDetails
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (!canvas) return;
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "cds-checkin-qr.png";
        a.click();
    };


    if (!admin?.lgaDetails?.checkInSlug || !admin) {
        return (
            <div>
                Please update the lga details to generate the necessary configuration for the LGA.
            </div>
        )
    }
    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col items-center gap-4 mb-6" >
            <div className="w-full">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Check-in QR Code
                </p>
                <p className="text-xs text-slate-500">
                    Download and share to access the check-in page or just share the link.
                </p>
            </div>

            <div ref={qrRef} className="p-4 bg-white rounded-xl border border-slate-200">
                <QRCodeCanvas
                    value={checkInUrl} // same url you're already displaying
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#153619"
                    level="H"
                />
            </div>

            <button
                onClick={handleDownload}
                className="w-full py-3 rounded-xl border border-[#2b7234] text-[#2b7234] text-sm font-bold tracking-wide hover:bg-[#2b7234] hover:text-white transition-all"
            >
                Download QR Code
            </button>
        </ div>
    );
}

export default QRCode;