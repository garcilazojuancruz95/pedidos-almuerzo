import { createContext, useContext, useEffect, useState } from "react";
import {
    getSession,
    onAuthStateChange,
} from "../services/auth.service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSession() {
            const session = await getSession();
            setSession(session);
            setLoading(false);
        }

        loadSession();

        const {
            data: { subscription },
        } = onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
        value={{
            session,
            loading,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext)
}