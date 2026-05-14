import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuth } from '../store/authStore';
import api from '../lib/axios';

type ScanStatus = 'scanning' | 'processing' | 'valid' | 'already_scanned' | 'wrong_session' | 'invalid_qr' | 'no_session' | 'error';

interface ScanResult {
    name: string;
    stateCode: string;
    queueNumber: number;
}

export default function Scanner() {
    const { admin } = useAuth();
    const checkInSlug = admin?.lgaDetails?.checkInSlug;

    const [status, setStatus] = useState<ScanStatus>('scanning');
    const [result, setResult] = useState<ScanResult | null>(null);

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isRunningRef = useRef(false);
    const isProcessingRef = useRef(false);

    const startScanner = () => {
        const scanner = scannerRef.current;
        if (!scanner || isRunningRef.current) return;

        scanner
            .start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 250 },
                handleScan,
                () => { }
            )
            .then(() => { isRunningRef.current = true; })
            .catch(() => setStatus('error'));
    };

    const stopScanner = async () => {
        const scanner = scannerRef.current;
        if (!scanner || !isRunningRef.current) return;
        await scanner.stop();
        isRunningRef.current = false;
    };

    useEffect(() => {
        scannerRef.current = new Html5Qrcode('qr-reader');
        startScanner();

        return () => {
            stopScanner().then(() => scannerRef.current?.clear());
        };
    }, []);

    const handleScan = async (decodedText: string) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        await stopScanner();
        setStatus('processing');

        let qrData: any;
        try {
            qrData = JSON.parse(decodedText);
        } catch {
            setStatus('invalid_qr');
            return;
        }

        const { sessionId, queueNumber, stateCode } = qrData;
        if (!sessionId || !queueNumber || !stateCode) {
            setStatus('invalid_qr');
            return;
        }

        try {
            const res = await api.post('/admin/scan', {
                sessionId, queueNumber, stateCode, checkInSlug,
            });

            if (res.data.success) {
                setResult(res.data);
                setStatus('valid');
            } else {
                setStatus(res.data.status ?? 'error');
            }
        } catch {
            setStatus('error');
        }
    };

    const handleScanAgain = async () => {
        setResult(null);
        isProcessingRef.current = false;
        isRunningRef.current = false;

        // Tear down the old instance completely
        if (scannerRef.current) {
            try { await scannerRef.current.clear(); } catch { }
        }

        // Fresh instance — avoids any internal state from the previous scan
        scannerRef.current = new Html5Qrcode('qr-reader');

        setStatus('scanning');
        startScanner();
    };

    const isDone = status !== 'scanning' && status !== 'processing';

    const errorMessages: Partial<Record<ScanStatus, string>> = {
        already_scanned: 'This corper has already been scanned.',
        wrong_session: 'QR is from a different session.',
        invalid_qr: 'Invalid QR code.',
        no_session: 'No active session found.',
        error: 'Something went wrong. Try again.',
    };

    return (
        <div className="flex flex-col items-center gap-6 p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold text-slate-800">Scan QR Code</h2>

            {/* Camera viewport — always in DOM so html5-qrcode has its element */}
            <div
                id="qr-reader"
                className={`w-full rounded-xl overflow-hidden ${status !== 'scanning' ? 'hidden' : ''}`}
            />

            {/* Processing */}
            {status === 'processing' && (
                <div className="flex flex-col items-center gap-3 py-8">
                    <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                    <p className="text-sm text-slate-500">Verifying...</p>
                </div>
            )}

            {/* Valid result */}
            {status === 'valid' && result && (
                <div className="w-full rounded-xl border border-green-200 bg-green-50 p-4 space-y-1">
                    <p className="text-sm text-slate-600">Name: <span className="font-semibold text-slate-800">{result.name}</span></p>
                    <p className="text-sm text-slate-600">State Code: <span className="font-semibold text-slate-800">{result.stateCode}</span></p>
                    <p className="text-sm text-slate-600">Queue #: <span className="font-semibold text-slate-800">{result.queueNumber}</span></p>
                </div>
            )}

            {/* Error states */}
            {isDone && status !== 'valid' && (
                <p className="text-sm font-medium text-red-500">{errorMessages[status]}</p>
            )}

            {/* Scan Again button — shown after any terminal state */}
            {isDone && (
                <button
                    onClick={handleScanAgain}
                    className="w-full  text-white text-sm font-medium py-2.5 px-4 rounded-xl bg-[#2b7234] hover:bg-[#153619] transition-colors"
                >
                    Scan Again
                </button>
            )}
        </div>
    );
}