import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/axios";

export type AdminType = {
    id: number;
    name: string;
    email: string;
}
interface AuthType {
    isAdmin: null | any,
    isAuthenticated: boolean,
    login: (email: string, password: string) => Promise<boolean>;
    admin: AdminType | null;
    sessionId: string
}
export const useAuth = create<AuthType>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            isAdmin: null,
            admin: null,
            sessionId: '',

            login: async (email: string, password: string) => {
                try {
                    const res = await api.post('/admin-login', { email, password });
                    if (res.data.success) {
                        set({ isAdmin: res.data.isAdmin, isAuthenticated: res.data.success });
                        return true;
                    }
                    return false
                } catch (error) {
                    console.error('Login error:', error);
                    return false;
                }
            }
        }),
        { name: "auth-store" }
    )
);