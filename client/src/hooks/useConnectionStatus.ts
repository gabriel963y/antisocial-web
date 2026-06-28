import { useState, useEffect } from 'react'
import { API_BASE } from '../lib/api/endpoints.ts'

export function useConnectionStatus() {
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        let cancelled = false

        const check = async () => {
            try {
                const res = await fetch(`${API_BASE}/users?limit=1`, {
                    method: 'GET',
                    signal: AbortSignal.timeout(3000),
                })
                if (!cancelled) setConnected(res.ok)
            } catch {
                if (!cancelled) setConnected(false)
            }
        }

        check()
        const interval = setInterval(check, 10000)

        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [])

    return connected
}
