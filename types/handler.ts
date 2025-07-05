/**
 * Base Lambda event interface for API Gateway events.
 */
export interface LambdaEvent {
  body?: string;
  user?: { id: string; role?: string };
  httpMethod?: string;
  queryStringParameters?: {
    access_token?: string;
    refresh_token?: string;
  };
  path?: string;
  pathParameters?: {
    proxy?: string;
  };
  headers?: {
    [key: string]: string;
  };
}

/**
 * Standard Lambda response interface.
 */
export interface LambdaResponse {
  statusCode: number;
  headers: {
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Headers": string;
    "Access-Control-Allow-Methods": string;
    "Content-Type": string;
  };
  body: string;
}

/**
 * Success response data interface.
 */
export interface SuccessResponseData {
  success: true;
  message?: string;
  data?: any;
  [key: string]: any;
}

/**
 * Error response data interface.
 */
export interface ErrorResponseData {
  success: false;
  message: string;
  errorType: string;
}

/**
 * Handler function type definition.
 */
export type HandlerFunction = (event: LambdaEvent) => Promise<LambdaResponse>;

// Request/Response interfaces for specific endpoints

/**
 * Sign-up request interface.
 */
export interface SignUpRequest {
  email: string;
  password: string;
}

/**
 * Sign-up response interface.
 */
export interface SignUpResponse {
  message: string;
  data: {
    id: string;
    email: string;
  };
}

/**
 * Sign-in request interface.
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Sign-in response interface.
 */
export interface SignInResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
}

/**
 * Email verification webhook request interface.
 */
export interface EmailVerificationWebhookRequest {
  access_token: string;
  refresh_token?: string;
}

/**
 * Email verification webhook response interface.
 */
export interface EmailVerificationWebhookResponse {
  message: string;
  data: {
    email: string;
    verified: boolean;
  };
}

/**
 * Create user request interface (admin only).
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  role?: string;
}

/**
 * Create user response interface.
 */
export interface CreateUserResponse {
  message: string;
  data: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Request password reset interface.
 */
export interface RequestPasswordResetRequest {
  email: string;
}

/**
 * Request password reset response interface.
 */
export interface RequestPasswordResetResponse {
  message: string;
  data: {
    email: string;
    resetTokenSent: boolean;
  };
}

/**
 * Reset password request interface.
 */
export interface ResetPasswordRequest {
  accessToken: string;
  refreshToken: string;
  newPassword: string;
}

/**
 * Reset password response interface.
 */
export interface ResetPasswordResponse {
  message: string;
  data: {
    email: string;
    passwordUpdated: boolean;
  };
}

/**
 * Delete user request interface (admin only).
 */
export interface DeleteUserRequest {
  email: string;
}

/**
 * Delete user response interface.
 */
export interface DeleteUserResponse {
  message: string;
  data: {
    email: string;
    deleted: boolean;
  };
}

/**
 * Fetch user response interface.
 */
export interface FetchUserResponse {
  message: string;
  data: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

/**
 * Health check response interface.
 */
export interface HealthResponse {
  status: string;
  database: boolean;
  supabase: boolean;
  timestamp: string;
}

/**
 * Sync request logs response interface.
 */
export interface SyncRequestLogsResponse {
  message: string;
  syncedCount: number;
}

/**
 * CORS response interface.
 */
export interface CORSResponse {
  message: string;
}

// Specific handler function types

export type SignUpHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
export type SignInHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
export type EmailVerificationWebhookHandler = (
  event: LambdaEvent
) => Promise<LambdaResponse>;
export type CreateUserHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
export type RequestPasswordResetHandler = (
  event: LambdaEvent
) => Promise<LambdaResponse>;
export type ResetPasswordHandler = (
  event: LambdaEvent
) => Promise<LambdaResponse>;
export type DeleteUserHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
export type FetchUserHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
export type HealthHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
export type SyncRequestLogsHandler = (
  event: LambdaEvent
) => Promise<LambdaResponse>;
export type CORSHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
