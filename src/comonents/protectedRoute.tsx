import { Navigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAdmin, isAuthenticated } = useAuth()

    if (!isAdmin && !isAuthenticated) {
        return <Navigate to='/admin-login' replace />
    }

    return (<>{children}</>);
}

export default ProtectedRoute;