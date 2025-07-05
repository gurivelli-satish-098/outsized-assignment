import { ValidationError, UnauthorizedError } from "../utils/error";
import { AuthService } from "../services/auth";
import DatabaseContext from "../clients/mysql";

/**
 * Middleware to validate JWT token and attach user to event.
 * @param {any} event - Lambda event object.
 * @returns {Promise<boolean>} True if valid, throws otherwise.
 */
export const validateToken = async (event: any): Promise<boolean> => {
  try {
    const db = DatabaseContext.db;
    const authService = new AuthService(db);

    // Extract token from Authorization header
    const authHeader =
      event.headers?.Authorization || event.headers?.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("Authorization header is required");
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Invalid authorization format. Use 'Bearer <token>'"
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new UnauthorizedError("Token is required");
    }

    // Validate token using auth service
    const user = await authService.validateToken(token);

    // Add user to event for use in handler
    event.user = user;

    return true;
  } catch (error) {
    console.log("Token validation error:", error);
    throw error;
  }
};

/**
 * Middleware to validate admin role.
 * @param {any} event - Lambda event object.
 * @returns {Promise<boolean>} True if admin, throws otherwise.
 */
export const validateAdmin = async (event: any): Promise<boolean> => {
  try {
    // First validate the token
    await validateToken(event);

    // Check if user has admin role
    if (event.user.role !== "ADMIN") {
      throw new ValidationError("Only admins can perform this action");
    }

    return true;
  } catch (error) {
    console.log("Admin validation error:", error);
    throw error;
  }
};
