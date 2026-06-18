import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useAuth } from "../store/authStore";
import api from "../lib/axios";
import { Link } from "react-router-dom";
import { MdLock } from "react-icons/md";

type ScanStatus =
  | "scanning"
  | "already_scanned"
  | "processing"
  | "valid"
  | "invalid_qr"
  | "session_ended"
  | "error";

interface ScanResult {
  name: string;
  stateCode: string;
  queueNumber: number;
}

export default function Scanner() {
  const { admin, session } = useAuth();
  const checkInSlug = admin?.lgaDetails?.checkInSlug;

  const [status, setStatus] = useState<ScanStatus>("scanning");
  const [result, setResult] = useState<ScanResult | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const isProcessingRef = useRef(false);

  const handleScan = async (scanResult: QrScanner.ScanResult) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    scannerRef.current?.stop();
    setStatus("processing");

    let qrData: any;
    try {
      qrData = JSON.parse(scanResult.data);
    } catch {
      setStatus("invalid_qr");
      return;
    }

    const { sessionId, queueNumber, stateCode } = qrData;
    if (!sessionId || !queueNumber || !stateCode) {
      setStatus("invalid_qr");
      return;
    }

    try {
      const res = await api.post("/admin/scan", {
        sessionId,
        queueNumber,
        stateCode,
        checkInSlug,
      });

      console.log(res);
      if (res.data.success) {
        setResult(res.data);
        setStatus("valid");
      } else {
        setStatus(res.data.status ?? "error");
      }
    } catch (err: any) {
      const backendStatus = err?.response?.data?.status;
      setStatus(backendStatus ?? "error");
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(videoRef.current, handleScan, {
      preferredCamera: "environment",
      highlightScanRegion: true,
      highlightCodeOutline: true,
    });

    scannerRef.current = scanner;
    scanner.start().catch(() => setStatus("error"));

    return () => {
      scanner.destroy();
      scannerRef.current = null;
    };
  }, []);

  const handleScanAgain = async () => {
    setResult(null);
    isProcessingRef.current = false;

    // Destroy old instance and spin up a fresh one
    scannerRef.current?.destroy();

    if (!videoRef.current) return;

    const scanner = new QrScanner(videoRef.current, handleScan, {
      preferredCamera: "environment",
      highlightScanRegion: true,
      highlightCodeOutline: true,
    });

    scannerRef.current = scanner;
    setStatus("scanning");
    scanner.start().catch(() => setStatus("error"));
  };

  const isDone = status !== "scanning" && status !== "processing";

  const errorMessages: Partial<Record<ScanStatus, string>> = {
    invalid_qr: "Invalid QR code.",
    already_scanned: "This number has already been validated.",
    session_ended: "The session for this qr code has expired.",
    error: "Something went wrong. Try again.",
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-sm mx-auto">
      <h2 className="text-lg font-semibold text-slate-800">Scan QR Code</h2>

      {/* Video element — qr-scanner mounts directly onto this */}
      {session?.isOpen ? (
        <video
          ref={videoRef}
          className={`w-full rounded-xl overflow-hidden ${status !== "scanning" ? "hidden" : ""}`}
        />
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
          <MdLock className="text-4xl text-slate-200" />

          <h3 className="text-sm font-semibold text-slate-600">
            No active session
          </h3>

          <p className="text-xs text-slate-400 max-w-xs">
            You need to open a session before check-ins can be recorded, viewed
            or scanned.
          </p>

          <Link
            to={"/admin"}
            className="mt-2 text-xs font-semibold text-white bg-[#2b7234] px-4 py-2 rounded-lg hover:bg-[#245c2b] transition"
          >
            Open Session
          </Link>
        </div>
      )}

      {status === "processing" && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Verifying...</p>
        </div>
      )}

      {status === "valid" && result && (
        <div className="w-full rounded-xl border border-green-200 bg-green-50 p-4 space-y-1">
          <p className="text-sm text-slate-600">
            Name:{" "}
            <span className="font-semibold text-slate-800">{result.name}</span>
          </p>
          <p className="text-sm text-slate-600">
            State Code:{" "}
            <span className="font-semibold text-slate-800">
              {result.stateCode}
            </span>
          </p>
          <p className="text-sm text-slate-600">
            Queue #:{" "}
            <span className="font-semibold text-slate-800">
              {result.queueNumber}
            </span>
          </p>
        </div>
      )}

      {isDone && status !== "valid" && (
        <p className="text-sm font-medium text-red-500">
          {errorMessages[status]}
        </p>
      )}

      {isDone && (
        <button
          onClick={handleScanAgain}
          className="w-full text-white text-sm font-medium py-2.5 px-4 rounded-xl bg-[#2b7234] hover:bg-[#153619] transition-colors"
        >
          Scan Again
        </button>
      )}
    </div>
  );
}
