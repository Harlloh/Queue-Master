import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthType {
    isAdmin: null | any,
    isAuthenticated: boolean
}
export const useAuth = create<AuthType>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            isAdmin: null,
        }),
        { name: "auth-store" }
    )
);