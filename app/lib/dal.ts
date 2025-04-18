import 'server-only'
 
import { cookies } from 'next/headers'
import { createAuthSession, decrypt, deleteNonce } from '@/app/lib/sessions'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { getUserByEmail, getUserById } from '@/models/user.server'

export const verifySession = cache(async () => {
  const authSession = (await cookies()).get('fitizen__auth_session')?.value
  const payload = await decrypt(authSession)

  if (!authSession || !payload) {
    redirect('/login')
  }
 
  return { isAuth: true, userId: payload.id }
})

export const getCurrentUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null
 
  try {
    const data = await getUserById(session.userId as string)
 
    const user = data[0]
 
    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})

export const magicLinkGetUser = cache(async (email: string) => {
  // const session = await verifySession()
  // if (!session) return null
 
  try {
    const data = await getUserByEmail(email)
 
    const user = data[0]
 
    return user
  } catch (error) {
    console.log('Failed to fetch user by email')
    return null
  }
})

export const validateMagicLinkUser = cache(async (email: string) => {
  try {
    const user = await magicLinkGetUser(email);
    if (user) {
      await deleteNonce();
      await createAuthSession({ id: user.id });
      return user;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
})