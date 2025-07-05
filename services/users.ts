import { SupabaseConnection } from "../clients/supabase";
import { InternalError, ValidationError } from "../utils/error";
import { SALT_ROUNDS, ROLE_ID_MAP } from "../constants";
import bcrypt from "bcrypt";

/**
 * Service for user management logic.
 */
export class UserService {
  private db: any;
  private supabase: any;

  /**
   * Create a new UserService instance.
   * @param {any} db - Database connection object.
   * @param {any} supabase - Supabase client instance.
   */
  constructor(db: any, supabase: any) {
    this.db = db;
    this.supabase = supabase;
  }

  /**
   * Check the health of the database and Supabase connection.
   * @returns {Promise<{ message: string }>} Health status response.
   */
  checkHealth = async (): Promise<{ message: string }> => {
    try {
      const [dbResult, { data, error }] = await Promise.all([
        this.db.sequelize.query(`SELECT 1;`, {
          type: this.db.sequelize.QueryTypes.SELECT,
        }),
        this.supabase.from("users").select("uuid").limit(1),
      ]);
      if (error) {
        throw new InternalError("Supabase DB unreachable: " + error.message);
      }
      return {
        message: "Server is UP!",
      };
    } catch (error: any) {
      throw new InternalError("DB unreachable: " + error.message);
    }
  };

  /**
   * Fetch a user by filter.
   * @param {any} filter - Filter object for user lookup.
   * @param {any} [options] - Additional query options.
   * @returns {Promise<any>} User record if found.
   */
  fetchUserById = async (filter: any, options: any = {}): Promise<any> => {
    try {
      return await this.db.User.findOne({
        where: filter,
        attributes: options?.attributes,
      });
    } catch (error: any) {
      throw new InternalError("Failed to fetch user: " + error.message);
    }
  };

  /**
   * Create a new user and assign a role.
   * @param {object} params - User creation details.
   * @returns {Promise<any>} User creation result and message.
   */
  createUser = async ({
    email,
    password,
    role = "CUSTOMER",
    createdBy,
  }: {
    email: string;
    password: string;
    role?: string;
    createdBy?: string;
  }): Promise<any> => {
    try {
      const existingUser = await this.db.User.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new ValidationError("User with this email already exists");
      }
      const { data: supabaseUser, error: supabaseError } =
        await this.supabase.auth.signUp({
          email,
          password,
        });
      if (supabaseError) {
        throw new InternalError(
          "Auth creation failed: " + supabaseError.message
        );
      }
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const userRecord = await this.db.User.create({
        uuid: supabaseUser.user.id,
        email,
        password: hashedPassword,
        verified: true,
        active: true,
      });
      await this.db.UserRole.create({
        userId: userRecord.id,
        roleId: ROLE_ID_MAP[role as keyof typeof ROLE_ID_MAP],
        assignedBy: createdBy,
      });
      return {
        user: {
          id: userRecord.uuid,
          email: userRecord.email,
          role: role,
          created: true,
        },
        message: "User created successfully",
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new InternalError("Failed to create user: " + error.message);
    }
  };

  /**
   * Get a user's profile from Supabase.
   * @param {object} params - User profile lookup details.
   * @returns {Promise<any>} User profile data.
   */
  getUserProfile = async ({ userId }: { userId: string }): Promise<any> => {
    const { data: userProfile, error: profileError } = await this.supabase
      .from("users")
      .select("uuid, email, role, created_at, updated_at")
      .eq("uuid", userId)
      .single();
    if (profileError) {
      throw new InternalError(
        "Failed to fetch user profile: " + profileError.message
      );
    }
    if (!userProfile) {
      throw new ValidationError("User profile not found");
    }
    return {
      user: {
        id: userProfile.uuid,
        email: userProfile.email,
        role: userProfile.role || "CUSTOMER",
        created_at: userProfile.created_at,
        updated_at: userProfile.updated_at,
      },
    };
  };
}
