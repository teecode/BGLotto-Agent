/**
 * Signing in and out, and knowing when a session has run out.
 *
 * The token is a JWT, so its expiry can be read without asking the server.
 */
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

/** When the token stops being accepted, in milliseconds since 1970; null when it cannot be read */
export function tokenExpiry(token: string | null | undefined): number | null {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const exp = Number(JSON.parse(json).exp)
    return Number.isFinite(exp) && exp > 0 ? exp * 1000 : null
  } catch {
    return null
  }
}

/** True only when the token says so itself. A token that cannot be read is left for the server to judge. */
export function isTokenExpired(token: string | null | undefined): boolean {
  const expiry = tokenExpiry(token)
  return expiry !== null && expiry <= Date.now()
}

export function isSignedIn(): boolean {
  const auth = useAuthStore()
  return auth.isLoggedIn && !isTokenExpired(auth.token)
}

/** Forgets the signed-in agent. Navigation is left to the caller. */
export function clearSession(): void {
  const auth = useAuthStore()
  auth.token = null
  auth.user = {}
  useNotificationStore().reset()
}

/**
 * Only paths inside the portal are followed after signing in, never another
 * site or the sign-in page itself.
 */
export function safeRedirect(value: unknown): string {
  if (typeof value !== 'string') return ''
  if (!value.startsWith('/dashboard') || value.startsWith('//')) return ''
  return value
}
