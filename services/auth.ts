import { SALT_ROUNDS, ROLE_ID_MAP, ROLE_MAP } from "../constants";
import { InternalError, ValidationError, BaseError } from "../utils/error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

/**
 * Service for authentication and user management operations.
 */
export class AuthService {
  private supabase: any;
  private db: any;

  /**
   * Create a new AuthService instance.
   * @param {any} db - Database connection object.
   * @param {any} [supabase] - Supabase client instance.
   */
  constructor(db: any, supabase?: any) {
    this.supabase = supabase;
    this.db = db;
  }

  /**
   * Generate a JWT token for a user.
   * @param {any} user - User object containing id and role.
   * @returns {string} The generated JWT token.
   */
  generateJWT = (user: any): string => {
    const payload = {
      uuid: user.id,
      role: user.role || "CUSTOMER",
    };
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "3m",
    });
  };

  /**
   * Register a new user with email verification.
   * @param {object} params - User registration parameters.
   * @param {string} params.email - User's email address.
   * @param {string} params.password - User's password.
   * @param {string} [params.role="CUSTOMER"] - User's role.
   * @param {string} [params.assignedBy] - ID of user who assigned this role.
   * @param {object} [options] - Additional options.
   * @param {boolean} [options.tokenRequired=true] - Whether to generate a JWT token.
   * @returns {Promise<object>} Registration result with user data and optional token.
   */
  signUp = async (
    {
      email,
      password,
      role = "CUSTOMER",
      assignedBy,
    }: { email: string; password: string; role?: string; assignedBy?: string },
    { tokenRequired = true }: { tokenRequired?: boolean } = {}
  ) => {
    // Create user in Supabase auth
    const { data: supabaseUser, error: supabaseError } =
      await this.supabase.auth.signUp({
        email,
        password,
      });
    if (supabaseError) {
      throw new InternalError("Auth creation failed: " + supabaseError.message);
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Find or create user in database
    const [userRecord, created] = await this.db.User.findOrCreate({
      where: { uuid: supabaseUser.user.id },
      defaults: {
        uuid: supabaseUser.user.id,
        email,
        password: hashedPassword,
      },
    });

    if (!created) {
      throw new ValidationError("User already exists. Please try SignIn");
    }
    await this.db.UserRole.create({
      userId: userRecord.id,
      roleId: ROLE_ID_MAP[role as keyof typeof ROLE_ID_MAP],
      assignedBy: assignedBy || userRecord.id,
    });

    // Generate JWT token
    const token =
      tokenRequired &&
      this.generateJWT({
        id: userRecord.uuid,
        role: role,
      });

    return {
      user: {
        id: supabaseUser.user.id,
        email: supabaseUser.user.email,
        role,
        created: created,
      },
      token,
    };
  };

  /**
   * Authenticate a user with email and password.
   * @param {object} params - Authentication parameters.
   * @param {string} params.email - User's email address.
   * @param {string} params.password - User's password.
   * @returns {Promise<object>} Authentication result with user data and JWT token.
   */
  signIn = async ({ email, password }: { email: string; password: string }) => {
    // Find user in database
    const userRecord = await this.db.User.findOne({
      where: { email },
      attributes: ["uuid", "email", "active", "verified", "password"],
      include: [
        {
          model: this.db.UserRole,
          as: "userRoles",
          attributes: ["roleId"],
        },
      ],
    });
    if (!userRecord) {
      throw new ValidationError("Invalid email or password");
    }
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userRecord.password);
    if (!isPasswordValid) {
      throw new ValidationError("Invalid email or password");
    }
    // Check if user is active
    if (!userRecord.active || !userRecord.verified) {
      throw new ValidationError("Account is not active or verified");
    }
    // Generate JWT token
    const token = this.generateJWT({
      id: userRecord.uuid,
      role:
        ROLE_MAP[userRecord?.userRoles?.[0]?.roleId as keyof typeof ROLE_MAP] ||
        "CUSTOMER",
    });

    return {
      user: {
        id: userRecord.uuid,
        email: userRecord.email,
        role:
          ROLE_MAP[
            userRecord?.userRoles?.[0]?.roleId as keyof typeof ROLE_MAP
          ] || "CUSTOMER",
      },
      token,
    };
  };

  /**
   * Request a password reset email for a user.
   * @param {object} params - Password reset request parameters.
   * @param {string} params.email - User's email address.
   * @returns {Promise<object>} Password reset request result.
   */
  requestPasswordReset = async ({ email }: { email: string }) => {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw new InternalError(
          "Failed to send reset password email: " + error.message
        );
      }

      return { email };
    } catch (error: any) {
      if (error instanceof BaseError) throw error;
      throw new InternalError(`Error to send link: ${error.message}`);
    }
  };

  /**
   * Validate a JWT token and return user information.
   * @param {object} params - Token validation parameters.
   * @param {string} params.token - JWT token to validate.
   * @returns {Promise<object>} User information if token is valid.
   */
  validateToken = async ({ token }: { token: string }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      if (typeof decoded !== "object" || !("uuid" in decoded)) {
        throw new ValidationError("Invalid token payload");
      }
      // Verify user still exists and is active
      const userRecord = await this.db.User.findOne({
        where: {
          id: (decoded as JwtPayload).uuid,
          active: true,
          verified: true,
        },
        attributes: ["id", "uuid", "email"],
        include: [
          {
            model: this.db.UserRole,
            as: "userRoles",
            attributes: ["roleId"],
          },
        ],
      });

      if (!userRecord) {
        throw new ValidationError("User not found or account deactivated");
      }

      return {
        id: userRecord.id,
        uuid: userRecord.uuid,
        email: userRecord.email,
        role:
          ROLE_MAP[
            userRecord?.userRoles?.[0]?.roleId as keyof typeof ROLE_MAP
          ] || "CUSTOMER",
      };
    } catch (error: any) {
      if (error.name === "JsonWebTokenError") {
        throw new ValidationError("Invalid token");
      } else if (error.name === "TokenExpiredError") {
        throw new ValidationError("Token expired");
      } else if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new ValidationError("Token validation failed");
      }
    }
  };

  /**
   * Reset a user's password using Supabase tokens.
   * @param {object} params - Password reset parameters.
   * @param {string} params.accessToken - Supabase access token.
   * @param {string} params.refreshToken - Supabase refresh token.
   * @param {string} params.newPassword - New password for the user.
   * @returns {Promise<object>} Password reset result.
   */
  resetPassword = async ({
    accessToken,
    refreshToken,
    newPassword,
  }: {
    accessToken: string;
    refreshToken: string;
    newPassword: string;
  }) => {
    try {
      const { error: sessionError } = await this.supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) {
        throw new InternalError(
          "Invalid or expired reset token: " + sessionError.message
        );
      }

      // Now update the password with the authenticated session
      const { data: updateData, error: updateError } =
        await this.supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        throw new InternalError(
          "Failed to update password: " + updateError.message
        );
      }

      // Find user by email from update response
      const userRecord = await this.db.User.findOne({
        where: { email: updateData.user.email, active: true, verified: true },
      });

      if (!userRecord) {
        throw new ValidationError("User not found or account deactivated");
      }

      // Hash new password for database
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Update password in database
      await this.db.User.update(
        { password: hashedPassword },
        { where: { id: userRecord.id } }
      );

      return {
        user: {
          id: userRecord.uuid,
          email: userRecord.email,
        },
        message: "Password reset successfully",
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      } else if (error instanceof BaseError) {
        throw error;
      } else {
        throw new InternalError(`Error to reset password: ${error.message}`);
      }
    }
  };

  /**
   * Delete a user account (admin only).
   * @param {object} params - User deletion parameters.
   * @param {string} params.email - Email of user to delete.
   * @param {string} params.deletedBy - ID of user performing the deletion.
   * @returns {Promise<object>} User deletion result.
   */
  deleteUser = async ({
    email,
    deletedBy,
  }: {
    email: string;
    deletedBy: string;
  }) => {
    try {
      const userRecord = await this.db.User.findOne({
        where: { email, active: true, verified: true },
      });

      if (!userRecord) {
        throw new ValidationError(
          "User not found or account already deactivated"
        );
      }

      // Delete user from Supabase auth first
      const { error: authError } = await this.supabase.auth.admin.deleteUser(
        userRecord.uuid
      );

      if (authError) {
        throw new InternalError(
          "Failed to delete user from auth: " + authError.message
        );
      }

      // Delete user from database
      await this.db.User.update(
        { active: false },
        { where: { id: userRecord.id } }
      );

      return {
        deletedUserEmail: userRecord.email,
        deletedBy: deletedBy,
        deletedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      } else if (error instanceof BaseError) {
        throw error;
      } else {
        throw new InternalError(`Error deleting user: ${error.message}`);
      }
    }
  };

  /**
   * Handle email verification webhook from Supabase.
   * @param {object} params - Email verification parameters.
   * @param {string} params.email - User's email address.
   * @param {string} params.accessToken - Supabase access token.
   * @param {string} params.refreshToken - Supabase refresh token.
   * @returns {Promise<object>} Email verification result.
   */
  emailVerificationWebhook = async ({
    email,
    accessToken,
    refreshToken,
  }: {
    email: string;
    accessToken: string;
    refreshToken: string;
  }) => {
    try {
      // Set the session with the tokens from Supabase
      const { error: sessionError } = await this.supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        throw new InternalError(
          "Invalid or expired verification token: " + sessionError.message
        );
      }

      // Find user in database
      const userRecord = await this.db.User.findOne({
        where: { email, active: true },
      });

      if (!userRecord) {
        throw new ValidationError("User not found or account deactivated");
      }

      // Update user as verified in database
      await this.db.User.update(
        { verified: true },
        { where: { id: userRecord.id } }
      );

      return {
        user: {
          id: userRecord.uuid,
          email: userRecord.email,
          verified: true,
        },
        message: "Email verified successfully",
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      } else if (error instanceof BaseError) {
        throw error;
      } else {
        throw new InternalError(`Error verifying email: ${error.message}`);
      }
    }
  };
}
