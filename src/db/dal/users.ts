import { eq } from 'drizzle-orm'
import { db } from '..'
import { createHash } from 'crypto'
import { users } from '../schema'

export interface CreateUserInput {
  email: string
  password: string
  name: string
}

export class UserDAL {
  private static hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex')
  }

  static async createUser(input: CreateUserInput) {
    const hashedPassword = this.hashPassword(input.password)

    try {
      const [user] = await db
        .insert(users)
        .values({
          ...input,
          password: hashedPassword,
        })
        .returning()

      return user
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('UNIQUE constraint failed')
      ) {
        throw new Error('Email already exists')
      }
      throw error
    }
  }

  static async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user
  }

  static async findById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id))
    return user
  }

  static async verifyPassword(
    email: string,
    password: string
  ): Promise<boolean> {
    const user = await this.findByEmail(email)
    if (!user) return false

    const hashedPassword = this.hashPassword(password)
    return user.password === hashedPassword
  }
}
