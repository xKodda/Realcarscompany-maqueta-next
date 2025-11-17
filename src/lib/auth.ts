import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export interface SessionUser {
  id: number
  email: string
  name: string
  role: string
}

export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Create a JWT token
 */
function createToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Verify and decode JWT token
 */
function verifyToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Login user and create session
 */
export async function login(credentials: LoginCredentials): Promise<{ user: SessionUser } | null> {
  const { email, password } = credentials

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user) {
    return null
  }

  // Check if user is active
  if (!user.isActive) {
    return null
  }

  // Check if user has admin role
  if (user.role !== 'admin') {
    return null
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.passwordHash)
  if (!isValidPassword) {
    return null
  }

  // Create session user
  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }

  // Create token
  const token = createToken(sessionUser)

  // Set secure HTTP-only cookie
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return { user: sessionUser }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

/**
 * Get current logged-in user from session
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (!sessionCookie?.value) {
    return null
  }

  const user = verifyToken(sessionCookie.value)
  if (!user) {
    return null
  }

  // Verify user still exists and is active
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!dbUser || !dbUser.isActive || dbUser.role !== 'admin') {
    return null
  }

  return user
}

/**
 * Require authentication - throws redirect if not authenticated
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/admin/login')
  }

  return user
}

/**
 * Check if user is authenticated (for client-side checks)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

