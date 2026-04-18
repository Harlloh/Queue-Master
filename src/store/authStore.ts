import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/axios";

export type AdminType = {
    id: string;
    name: string;
    email: string;
    lgaDetails: {
        name: string,
        latitude: number
        longitude: number
        radius: number
        updatedAt: string
        activeCdsGroup?: string[]
    }
}
export type SessionType = {
    id: string;
    urlString: string;
    sessionOpen: boolean;
    cdsGroupId: string;
    cdsGroupName: string;
    lgaId: string;
    openedAt: string;
}
interface AuthType {
    isAuthenticated: boolean,
    login: (email: string, password: string) => Promise<Boolean | any>;
    admin: AdminType | null;
    session: SessionType | null,
    setAdmin: (admin: AdminType | null) => void;
    setSession: (session: SessionType | null) => void;
    setIsAuthenticated: (value: boolean) => void;
}
export const useAuth = create<AuthType>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            admin: null,
            session: null,
            setAdmin: (value) => set({ admin: value }),
            setSession: (session) => set({ session }),
            setIsAuthenticated: (value) => set({ isAuthenticated: value }),

            login: async (email: string, password: string) => {
                try {
                    const res = await api.post('/auth/login', { email, password });
                    console.log(res);
                    if (res.data.success) {
                        set({ admin: res.data.admin, isAuthenticated: res.data.success });
                        return res.data;
                    }
                    return res.data
                } catch (error) {
                    console.error('Login error:', error);
                    throw error;
                }
            }
        }),
        { name: "auth-store" }
    )
);