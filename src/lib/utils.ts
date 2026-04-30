import React from "react";
import { MdLocationOn, MdLocationOff, MdLock, MdError } from "react-icons/md";
export const CARD_STATES: Record<string, any> = {
    loading: {
        icon: null, // custom spinner instead of icon
        title: null,
        message: "Verifying your location…",
        button: null,
        showSpinner: true,
    },
    requesting_location_access: {
        icon: React.createElement(MdLocationOn, { className: "text-5xl text-rose-500" }),
        title: "Getting your location...",
        message: "Location access is required. Please allow location in your browser.",
        button: null,
        showSpinner: false,
    },
    no_location: {
        icon: React.createElement(MdLocationOn, { className: "text-5xl text-rose-500" }),
        title: "No Location",
        message: "Attendance location is not set. Please contact admin.",
        button: null,
        showSpinner: false,
    },
    no_location_access: {
        icon: React.createElement(MdLocationOff, { className: "text-5xl text-rose-500" }),
        title: "Location access required",
        message: "Location access was denied. To fix this: tap the lock icon in your browser's address bar → Site Settings → Allow Location, then refresh the page",
        button: null,
        showSpinner: false,
    },
    no_session: {
        icon: React.createElement(MdLock, { className: "text-5xl text-slate-400" }),
        title: "No active session",
        message: "Attendance hasn't been opened yet. Check back shortly or contact your admin.",
        button: null,
        showSpinner: false,
    },
    outside: {
        icon: React.createElement(MdLocationOff, { className: "text-5xl text-amber-500" }),
        title: "You're not at the venue",
        message: "Your device is outside the allowed check-in area. Move closer to the LGA premises and try again.",
        button: {
            text: "Retry location check",
            action: "retry",
        },
        showSpinner: false,
    },
    poor_gps: {
        icon: React.createElement(MdLocationOff, { className: "text-5xl text-amber-500" }),
        title: "Weak GPS Signal",
        message: "Your location accuracy is too low to verify your position. Step outside, wait a few seconds, then retry.",
        button: {
            text: "Retry",
            action: "retry",
        },
        showSpinner: false,
    },
    // ─── NEW ERROR STATE ─────────────────────────────────────────
    error: {
        icon: React.createElement(MdError, { className: "text-5xl text-red-500" }),
        title: "Something went wrong",
        message: "An unexpected error occurred. Please try again.",
        button: {
            text: "Try Again",
            action: "retry",
        },
        showSpinner: false,
    },
    // You can also add specific error types:
    network_error: {
        icon: React.createElement(MdError, { className: "text-5xl text-red-500" }),
        title: "Network Error",
        message: "Unable to connect to the server. Check your internet connection.",
        button: {
            text: "Retry",
            action: "retry",
        },
        showSpinner: false,
    },
    submission_error: {
        icon: React.createElement(MdError, { className: "text-5xl text-red-500" }),
        title: "Check-in Failed",
        message: "We couldn't complete your check-in. Please verify your details and try again.",
        button: {
            text: "Try Again",
            action: "retry",
        },
        showSpinner: false,
    },
    // already_in: {
    //     icon: null,
    //     title: null,
    //     message: "You have already checked in",
    //     button: null,
    //     showSpinner: false,
    //     showQueueNumber: true,
    // },
    // success: {
    //     icon: <MdCheckCircle className="text-3xl text-emerald-500 mb-1" />,
    //     title: "Check-in successful!",
    //     message: null,
    //     button: null,
    //     showSpinner: false,
    //     showQueueNumber: true,
    // },
};


export interface SessionInterface {
    lga: string,
    cdsGroup: string,
    id: string
}