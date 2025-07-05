import DatabaseContext from "./clients/mysql";
import { SupabaseConnection } from "./clients/supabase";
import { UserService } from "./services/users";
import { AuthService } from "./services/auth";
import { successResponse, errorResponse } from "./utils/response";
import {
  signUpValidator,
  signInValidator,
  requestPasswordResetValidator,
  resetPasswordValidator,
  deleteUserValidator,
} from "./validators/auth";
import { rateLimiterMiddleware } from "./middlewares/rate-limiter";
import { validateToken, validateAdmin } from "./middlewares/auth";
import { RedisClient } from "./clients/redis";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import {
  LambdaEvent,
  LambdaResponse,
  SignUpRequest,
  SignInRequest,
  CreateUserRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  DeleteUserRequest,
  SignUpHandler,
  SignInHandler,
  EmailVerificationWebhookHandler,
  CreateUserHandler,
  RequestPasswordResetHandler,
  ResetPasswordHandler,
  DeleteUserHandler,
  FetchUserHandler,
  HealthHandler,
  SyncRequestLogsHandler,
  CORSHandler,
} from "./types/handler";

/**
 * CORS preflight handler for OPTIONS requests.
 * @param {LambdaEvent} event - Lambda event object.
 * @returns {Promise<LambdaResponse>} CORS headers response.
 */
export const corsHandler: CORSHandler = async (event: LambdaEvent) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // ✅ OPTIONAL fallback
      "Access-Control-Allow-Headers":
        "Content-Type,Authorization,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "CORS preflight successful" }),
  };
};

/**
 * Health check endpoint.
 * @param {LambdaEvent} event - Lambda event object.
 * @returns {Promise<LambdaResponse>} Health status response.
 */
export const health: HealthHandler = async (event: LambdaEvent) => {
  try {
    const db = await DatabaseContext.connect();
    const supabase = SupabaseConnection.getInstance().getClient();
    const userService = new UserService(db, supabase);
    const result = await userService.checkHealth();
    return successResponse(result);
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};

/**
 * User sign-up endpoint.
 * @param {LambdaEvent} event - Lambda event object containing email and password in the body.
 * @returns {Promise<LambdaResponse>} Sign-up result and message.
 */
export const signUp: SignUpHandler = async (event: LambdaEvent) => {
  try {
    await rateLimiterMiddleware(event);
    const db = await DatabaseContext.connect();
    const supabase = SupabaseConnection.getInstance().getClient();
    const authService = new AuthService(db, supabase);
    const { email, password }: SignUpRequest = JSON.parse(event.body || "{}");
    await signUpValidator({ email, password });
    const result = await authService.signUp({ email, password });
    return successResponse({
      message: "User signed up successfully. Verification Email Sent.",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};

/**
 * Email verification webhook endpoint.
 * @param {LambdaEvent} event - Lambda event object containing tokens in query parameters.
 * @returns {Promise<LambdaResponse>} Email verification result and message.
 */
export const emailVerificationWebhook: EmailVerificationWebhookHandler = async (
  event: LambdaEvent
) => {
  try {
    await rateLimiterMiddleware(event);
    const db = await DatabaseContext.connect();
    const supabase = SupabaseConnection.getInstance().getClient();
    const authService = new AuthService(db, supabase);

    // Get tokens from query parameters (sent by the HTML page)
    if (!event.queryStringParameters) {
      throw new Error("Query parameters are required");
    }

    const params = event.queryStringParameters;
    const accessToken = params.access_token || "";
    const refreshToken = params.refresh_token || "";

    if (!accessToken) {
      throw new Error("Access token is required");
    }

    // Extract email from the JWT token
    const decoded = jwt.decode(accessToken) as any;
    const email = decoded?.email;

    if (!email) {
      throw new Error("Email not found in token");
    }

    const result = await authService.emailVerificationWebhook({
      email,
      accessToken,
      refreshToken,
    });

    return successResponse({
      message: "Email verified successfully.",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};

/**
 * User sign-in endpoint.
 * @param {LambdaEvent} event - Lambda event object containing email and password in the body.
 * @returns {Promise<LambdaResponse>} Sign-in result and message.
 */
export const signIn: SignInHandler = async (event: LambdaEvent) => {
  try {
    await rateLimiterMiddleware(event);

    const db = await DatabaseContext.connect();
    const supabase = SupabaseConnection.getInstance().getClient();
    const authService = new AuthService(db, supabase);

    const { email, password }: SignInRequest = JSON.parse(event.body || "{}");
    await signInValidator({ email, password });
    const result = await authService.signIn({ email, password });

    return successResponse({
      message: "User signed in successfully.",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};

/**
 * Fetch user details endpoint.
 * @param {LambdaEvent} event - Lambda event object with authenticated user.
 * @returns {Promise<LambdaResponse>} User details response.
 */
export const fetchUser: FetchUserHandler = async (event: LambdaEvent) => {
  try {
    const db = await DatabaseContext.connect();
    const supabase = SupabaseConnection.getInstance().getClient();
    const userService = new UserService(db, supabase);

    await rateLimiterMiddleware(event);
    await validateToken(event);

    const result = await userService.fetchUserById(
      {
        id: event.user?.id,
      },
      { attributes: ["email", "name"] }
    );

    return successResponse({
      message: "User details fetched successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};

/**
 * Admin create user endpoint.
 * @param {LambdaEvent} event - Lambda event object containing new user details in the body.
 * @returns {Promise<LambdaResponse>} User creation result and message.
 */
export const createUser: CreateUserHandler = async (event: LambdaEvent) => {
  try {
    await rateLimiterMiddleware(event);

    const db = await DatabaseContext.connect();
    const supabase = SupabaseConnection.getInstance().getClient();
    const authService = new AuthService(db, supabase);

    // Validate admin token and role using middleware
    await validateAdmin(event);
    const {
      email,
      password,
      role = "CUSTOMER",
    }: CreateUserRequest = JSON.parse(event.body || "{}");
    // Basic validation
    await signUpValidator({ email, password });
    const result = await authService.signUp(
      {
        email,
        password,
        role,
        assignedBy: event.user?.id,
      },
      { tokenRequired: false }
    );
    return successResponse({
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};

/**
 * Request password reset endpoint.
 * @param {LambdaEvent} event - Lambda event object containing email in the body.
 * @returns {Promise<LambdaResponse>} Password reset request result and message.
 */
export const requestPasswordReset: RequestPasswordResetHandler = async (
  event: LambdaEvent
) => {
  try {
    await rateLimiterMiddleware(event);

    const db = await DatabaseContext.connect();
    const supabase = SupabaseConnection.getInstance().getClient();
    const authService = new AuthService(db, supabase);

    const { email }: RequestPasswordResetRequest = JSON.parse(
      event.body || "{}"
    );
    await requestPasswordResetValidator({ email });
    const result = await authService.requestPasswordReset({ email });

    return successResponse({
      message:
        "Password reset email sent successfully. Please check your email.",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};

/**
 * Reset password endpoint.
 * @param {LambdaEvent} event - Lambda event object containing accessToken, refreshToken, and newPassword in the body.
 * @returns {Promise<LambdaResponse>} Password reset result and message.
 */
export const resetPassword: ResetPasswordHandler = async (
  event: LambdaEvent
) => {
  try {
    await rateLimiterMiddleware(event);

    const db = await DatabaseContext.connect();
    const supabase = SupabaseConnection.getInstance().getClient();
    const authService = new AuthService(db, supabase);

    const { accessToken, refreshToken, newPassword }: ResetPasswordRequest =
      JSON.parse(event.body || "{}");
    await resetPasswordValidator({ accessToken, refreshToken, newPassword });
    const result = await authService.resetPassword({
      accessToken,
      refreshToken,
      newPassword,
    });

    return successResponse({
      message: "Password reset successfully.",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};

/**
 * Admin delete user endpoint.
 * @param {LambdaEvent} event - Lambda event object containing email in the body.
 * @returns {Promise<LambdaResponse>} User deletion result and message.
 */
export const deleteUser: DeleteUserHandler = async (event: LambdaEvent) => {
  try {
    await rateLimiterMiddleware(event);

    const db = await DatabaseContext.connect();
    const supabase = SupabaseConnection.getInstance().getClient();
    const authService = new AuthService(db, supabase);

    // Validate admin token and role using middleware
    await validateAdmin(event);

    const { email }: DeleteUserRequest = event.body
      ? JSON.parse(event.body)
      : {};
    await deleteUserValidator({ email });

    const result = await authService.deleteUser({
      email,
      deletedBy: event.user?.id ?? "",
    });

    return successResponse({
      message: "User account deleted successfully.",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};

/**
 * Sync request logs from Redis to the database.
 * @param {LambdaEvent} event - Lambda event object.
 * @returns {Promise<LambdaResponse>} Sync result and message.
 */
export const syncRequestLogsHandler: SyncRequestLogsHandler = async (
  event: LambdaEvent
) => {
  try {
    const redis = RedisClient.getInstance();
    const db = await DatabaseContext.connect();

    // Get all keys matching logs:requests:*
    const keys = await redis.keys("logs:requests:*");
    let totalSynced = 0;

    for (const key of keys) {
      const ip = (key || "").split(":")[2];
      const logs = await redis.lrange(key, 0, -1);
      if (logs.length === 0) continue;

      // Prepare logs for bulk insert
      const logRecords = logs.map((logStr) => {
        const log = JSON.parse(logStr);
        return {
          ipAddress: ip,
          path: log.path,
          method: log.method,
          timestamp: new Date(log.timestamp),
          extra: log.extra || null,
        };
      });

      // Bulk insert using Sequelize
      await db.RequestLog.bulkCreate(logRecords);
      totalSynced += logRecords.length;

      // Remove logs from Redis after syncing
      await redis.del(key);
    }

    return successResponse({
      message: "Synced logs from Redis to DB",
      syncedCount: totalSynced,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};
