"use client"

import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"

type SupabaseContextType = {
    supabase: ReturnType<typeof createClient>
    user: User | null
    isLoading: boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const [supabase] = useState(() => createClient())
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setIsLoading(false)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase])

    return (
        <SupabaseContext.Provider value={{ supabase, user, isLoading }}>
            {!isLoading && children}
        </SupabaseContext.Provider>
    )
}

export const useSupabase = () => {
    const context = useContext(SupabaseContext)
    if (context === undefined) {
        throw new Error("useSupabase must be used within a SupabaseProvider")
    }
    return context
}