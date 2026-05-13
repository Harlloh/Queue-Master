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
    const isProcessingRef = useRef(false);
    const isRunningRef = useRef(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        scanner
            .start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 250 },
                handleScan,
                () => { }
            )
            .then(() => { isRunningRef.current = true; })
            .catch(() => setStatus('error'));

        return () => {
            if (isRunningRef.current && scannerRef.current) {
                scannerRef.current.stop()
                    .then(() => scannerRef.current?.clear())
                    .catch(console.error);
                isRunningRef.current = false;
            }
        };
    }, []);

    const handleScan = async (decodedText: string) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        let qrData: any;
        try {
            qrData = JSON.parse(decodedText);
        } catch {
            setStatus('invalid_qr');
            scheduleReset();
            return;
        }

        const { sessionId, queueNumber, stateCode } = qrData;
        if (!sessionId || !queueNumber || !stateCode) {
            setStatus('invalid_qr');
            scheduleReset();
            return;
        }

        setStatus('processing');

        try {
            const res = await api.post('/admin/scan/validate', {
                sessionId, queueNumber, stateCode, checkInSlug,
            });

            if (res.data.success) {
                setResult(res.data);
                setStatus('valid');
            } else {
                setStatus(res.data.status);
            }
        } catch {
            setStatus('error');
        }

        scheduleReset();
    };


    const scheduleReset = () => {
        setTimeout(() => {
            setResult(null);
            setStatus('scanning');
            isProcessingRef.current = false;
        }, 3500);
    };

    const statusMessages: Record<ScanStatus, string> = {
        scanning: 'this is a test',
        processing: 'Verifying...',
        valid: '✓ Verified',
        already_scanned: '⚠ Already scanned',
        wrong_session: '✕ Wrong session — old number',
        invalid_qr: '✕ Invalid QR code',
        no_session: '⚠ No active session',
        error: '✕ Something went wrong',
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold text-slate-800">Scan QR Code</h2>

            <div id="qr-reader" className="w-full rounded-xl overflow-hidden" />

            <p className={`text-sm font-medium ${status === 'valid' ? 'text-green-600' : status === 'scanning' || status === 'processing' ? 'text-slate-500' : 'text-red-500'}`}>
                {statusMessages[status]}
            </p>

            {status === 'valid' && result && (
                <div className="w-full rounded-xl border border-green-200 bg-green-50 p-4 space-y-1">
                    <p className="text-sm text-slate-600">Name: <span className="font-semibold text-slate-800">{result.name}</span></p>
                    <p className="text-sm text-slate-600">State Code: <span className="font-semibold text-slate-800">{result.stateCode}</span></p>
                    <p className="text-sm text-slate-600">Queue #: <span className="font-semibold text-slate-800">{result.queueNumber}</span></p>
                </div>
            )}

        </div>
    );
}