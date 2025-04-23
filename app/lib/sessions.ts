import 'server-only'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { SessionPayload, SetupProfilePayload } from './definitions'
import { AUTH_SESSION_MAX_AGE, MAGIC_LINK_MAX_AGE } from '@/lib/magicNumbers'
 
const secretKey = process.env.AUTH_COOKIE_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
 
export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}

export async function createAuthSession({ id }: SessionPayload) {
  const currentDate = new Date()
  const expiresAt = new Date(currentDate.getTime() + AUTH_SESSION_MAX_AGE)
  const authSession = await encrypt({ id })
  const cookieStore = await cookies()
 
  cookieStore.set('fitizen__auth_session', authSession, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function updateAuthSession() {
  const authSession = (await cookies()).get('fitizen__auth_session')?.value
  const payload = await decrypt(authSession)
 
  if (!authSession || !payload) {
    return null
  }
 
  const currentDate = new Date()
  const expiresAt = new Date(currentDate.getTime() + AUTH_SESSION_MAX_AGE)
 
  const cookieStore = await cookies()
  cookieStore.set('fitizen__auth_session', authSession, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}


export async function deleteAuthSession() {
  const cookieStore = await cookies()
  cookieStore.delete('fitizen__auth_session')
}

export async function createNonce(nonce: string) {
  const nonceCheck = await encrypt({ nonce })
  const cookieStore = await cookies()
  const currentDate = new Date()
  const expiresAt = new Date(currentDate.getTime() + MAGIC_LINK_MAX_AGE)

  cookieStore.set('fitizen__nonce', nonceCheck, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function deleteNonce() {
  const cookieStore = await cookies()
  cookieStore.delete('fitizen__nonce')
}

export async function createSetupProfile({ email, provider, provider_user_id }: SetupProfilePayload) {
  const setupProfile = await encrypt({ email, provider, provider_user_id })
  const cookieStore = await cookies()
  const currentDate = new Date()
  const expiresAt = new Date(currentDate.getTime() + MAGIC_LINK_MAX_AGE)

  cookieStore.set('fitizen__setup_profile', setupProfile, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function deleteSetupProfile() {
  const cookieStore = await cookies()
  cookieStore.delete('fitizen__setup_profile')
}