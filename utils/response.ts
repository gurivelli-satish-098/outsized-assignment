import { BaseError } from "./error";

/**
 * Format a successful API response for AWS Lambda.
 * Creates a standardized response object that includes success flag and data.
 *
 * @param {any} data - The response data to be included in the response body
 * @param {number} [statusCode=200] - HTTP status code for the response
 * @returns {object} AWS Lambda response object with statusCode and JSON body
 *
 * @example
 * // Basic success response
 * const response = successResponse({ message: "User created successfully" });
 *
 * @example
 * // Success response with custom status code
 * const response = successResponse({ id: 123 }, 201);
 */
export function successResponse(data: any, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*", // ✅ OPTIONAL fallback
      "Access-Control-Allow-Headers":
        "Content-Type,Authorization,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ success: true, ...data }),
  };
}

/**
 * Format an error API response for AWS Lambda.
 * Handles different types of errors and creates appropriate error responses.
 *
 * @param {any} err - The error object (can be BaseError, Error, or any other type)
 * @param {number} [fallbackStatusCode=500] - Fallback HTTP status code if error type is unknown
 * @returns {object} AWS Lambda error response object with statusCode and JSON body
 *
 * @example
 * // Handle BaseError
 * try {
 *   throw new ValidationError("Invalid email format");
 * } catch (error) {
 *   return errorResponse(error);
 * }
 *
 * @example
 * // Handle generic error with custom status code
 * try {
 *   // some operation
 * } catch (error) {
 *   return errorResponse(error, 400);
 * }
 */
export function errorResponse(err: any, fallbackStatusCode = 500) {
  let statusCode = fallbackStatusCode;
  let message = "An unexpected error occurred";
  let errorType = "Error";

  if (err instanceof BaseError) {
    statusCode = err.statusCode;
    message = err.message;
    errorType = err.name;
  } else if (err instanceof Error) {
    message = err.message;
    errorType = err.name;
  }

  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*", // ✅ OPTIONAL fallback
      "Access-Control-Allow-Headers":
        "Content-Type,Authorization,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      success: false,
      message,
      errorType,
    }),
  };
}
