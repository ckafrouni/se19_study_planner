import { eq } from "drizzle-orm";
import { db } from "..";
import { createHash } from "crypto";
import { users } from "../schema";

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

export class UserDAL {
  // Hash the password using SHA-256
  private static hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  // Create a new user
  static async createUser(input: CreateUserInput) {
    const hashedPassword = this.hashPassword(input.password);

    try {
      const [user] = await db
        .insert(users)
        .values({
          ...input,
          password: hashedPassword,
        })
        .returning();

      return user;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("UNIQUE constraint failed")
      ) {
        throw new Error("Email already exists");
      }
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Find user by ID
  static async findById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  // Verify password
  static async verifyPassword(
    email: string,
    password: string
  ): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) return false;

    const hashedPassword = this.hashPassword(password);
    return user.password === hashedPassword;
  }
}
