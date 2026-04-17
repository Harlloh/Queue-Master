import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/axios";

export type AdminType = {
    id: string;
    name: string;
    email: string;
}
export type SessionType = {
    id: string;
    urlString: string;
}
interface AuthType {
    isAuthenticated: boolean,
    login: (email: string, password: string) => Promise<boolean>;
    admin: AdminType | null;
    session: SessionType | null,
    setAdmin: (admin: AdminType | null) => void;
    setSession: (session: SessionType | null) => void
}
export const useAuth = create<AuthType>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            admin: null,
            session: null,
            setAdmin: (admin) => set({ admin, isAuthenticated: !admin }),
            setSession: (session) => set({ session }),

            login: async (email: string, password: string) => {
                try {
                    const res = await api.post('/auth/login', { email, password });
                    console.log(res);
                    if (res.data.success) {
                        set({ admin: res.data.admin, isAuthenticated: res.data.success });
                        return true;
                    }
                    return res.data
                } catch (error) {
                    console.error('Login error:', error);
                    return false;
                }
            }
        }),
        { name: "auth-store" }
    )
);