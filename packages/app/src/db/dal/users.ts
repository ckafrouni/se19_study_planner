// authDal.ts
import { and, eq, gt, lt } from 'drizzle-orm'
import { LibSQLDatabase } from 'drizzle-orm/libsql'
import {
  users,
  InsertUser,
  SelectUser,
  passwordAuth,
  sessions,
  InsertSession,
  SelectSession,
} from '../schema'
import { randomBytes } from 'crypto'
import bcrypt from 'bcrypt'

/**
 * Authentication Data Access Layer for Turso/LibSQL
 * - Authentication via password uses bcrypt
 * - Handles all database operations related to users, authentication, and sessions
 */
export class AuthDAL {
  private db: LibSQLDatabase
  private readonly BCRYPT_SALT_ROUNDS = 12

  constructor(db: LibSQLDatabase) {
    this.db = db
  }

  // =========================
  // MARK: User Management
  // =========================

  async createUser(
    userData: Omit<InsertUser, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<SelectUser> {
    try {
      const result = await this.db.insert(users).values(userData).returning()

      if (result.length === 0) {
        throw new Error('Failed to create user')
      }

      return result[0]
    } catch (error: any) {
      if (error.message?.includes('UNIQUE constraint failed')) {
        throw new Error('User with this email already exists')
      }
      throw error
    }
  }

  async getUserById(id: number): Promise<SelectUser | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return result.length > 0 ? result[0] : null
  }

  async getUserByEmail(email: string): Promise<SelectUser | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return result.length > 0 ? result[0] : null
  }

  async updateUser(
    id: number,
    userData: Partial<Omit<InsertUser, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<SelectUser | null> {
    const result = await this.db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning()

    return result.length > 0 ? result[0] : null
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      return await this.db.transaction(async (tx) => {
        await tx.delete(passwordAuth).where(eq(passwordAuth.userId, id))
        await tx.delete(sessions).where(eq(sessions.userId, id))
        const result = await tx
          .delete(users)
          .where(eq(users.id, id))
          .returning({ id: users.id })

        return result.length > 0
      })
    } catch (error) {
      console.error('Failed to delete user:', error)
      return false
    }
  }

  // =========================
  // MARK: Password Authentication with bcrypt
  // =========================

  async createPasswordAuth(userId: number, password: string): Promise<void> {
    try {
      // Generate a hash with bcrypt (includes salt automatically)
      const passwordHash = await bcrypt.hash(password, this.BCRYPT_SALT_ROUNDS)

      await this.db.insert(passwordAuth).values({
        userId,
        password: passwordHash,
        salt: '', // Not needed with bcrypt but kept for schema compatibility
      })
    } catch (error: any) {
      if (error.message?.includes('UNIQUE constraint failed')) {
        throw new Error('Password authentication already exists for this user')
      }
      throw error
    }
  }

  async updatePassword(userId: number, newPassword: string): Promise<boolean> {
    try {
      // Generate a new hash with bcrypt
      const passwordHash = await bcrypt.hash(
        newPassword,
        this.BCRYPT_SALT_ROUNDS
      )

      const result = await this.db
        .update(passwordAuth)
        .set({
          password: passwordHash,
          salt: '', // Not needed with bcrypt but kept for schema compatibility
          updatedAt: new Date(),
        })
        .where(eq(passwordAuth.userId, userId))
        .returning({ userId: passwordAuth.userId })

      return result.length > 0
    } catch (error) {
      console.error('Failed to update password:', error)
      return false
    }
  }

  async verifyCredentials(
    email: string,
    password: string
  ): Promise<SelectUser | null> {
    const user = await this.getUserByEmail(email)
    if (!user) return null

    const authResult = await this.db
      .select()
      .from(passwordAuth)
      .where(eq(passwordAuth.userId, user.id))
      .limit(1)

    if (authResult.length === 0) return null
    const auth = authResult[0]

    // Compare with bcrypt
    const passwordMatch = await bcrypt.compare(password, auth.password)
    if (!passwordMatch) return null

    return user
  }

  // =========================
  // MARK: Session Management
  // =========================

  async createSession(
    userId: number,
    userAgent?: string,
    ipAddress?: string,
    expiryHours = 24 * 7
  ): Promise<SelectSession> {
    const token = randomBytes(32).toString('hex')
    const expires = new Date()
    expires.setHours(expires.getHours() + expiryHours)

    const result = await this.db
      .insert(sessions)
      .values({
        userId,
        token,
        expires,
        userAgent,
        ipAddress,
      })
      .returning()

    if (result.length === 0) {
      throw new Error('Failed to create session')
    }

    return result[0]
  }

  async getSessionByToken(
    token: string
  ): Promise<(SelectSession & { user: SelectUser }) | null> {
    const result = await this.db
      .select({
        session: sessions,
        user: users,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.token, token), gt(sessions.expires, new Date())))
      .limit(1)

    if (result.length === 0) return null

    return {
      ...result[0].session,
      user: result[0].user,
    }
  }

  async getUserSessions(userId: number): Promise<SelectSession[]> {
    return this.db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), gt(sessions.expires, new Date())))
  }

  async extendSession(token: string, expiryHours = 24): Promise<boolean> {
    const expires = new Date()
    expires.setHours(expires.getHours() + expiryHours)

    const result = await this.db
      .update(sessions)
      .set({ expires, updatedAt: new Date() })
      .where(eq(sessions.token, token))
      .returning({ id: sessions.id })

    return result.length > 0
  }

  async invalidateSession(token: string): Promise<boolean> {
    const result = await this.db
      .delete(sessions)
      .where(eq(sessions.token, token))
      .returning({ id: sessions.id })

    return result.length > 0
  }

  async invalidateAllUserSessions(userId: number): Promise<number> {
    const result = await this.db
      .delete(sessions)
      .where(eq(sessions.userId, userId))
      .returning({ id: sessions.id })

    return result.length
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.db
      .delete(sessions)
      .where(lt(sessions.expires, new Date()))
      .returning({ id: sessions.id })

    return result.length
  }
}
