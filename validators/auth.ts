import { ValidationError } from "../utils/error";

/**
 * Validate sign-up input.
 * @param {object} params - The input object with email and password.
 * @throws {ValidationError} If validation fails.
 */
export const signUpValidator = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const errors: string[] = [];

  // Email validation
  if (!email) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }

  // Password validation
  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    );
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "));
  }
};

/**
 * Validate sign-in input.
 * @param {object} params - The input object with email and password.
 * @throws {ValidationError} If validation fails.
 */
export const signInValidator = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const errors: string[] = [];

  if (!email) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "));
  }
};

/**
 * Validate password reset request input.
 * @param {object} params - The input object with email.
 * @throws {ValidationError} If validation fails.
 */
export const requestPasswordResetValidator = async ({
  email,
}: {
  email: string;
}) => {
  const errors: string[] = [];

  if (!email) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "));
  }
};

/**
 * Validate reset password input.
 * @param {object} params - The input object with accessToken, refreshToken, and newPassword.
 * @throws {ValidationError} If validation fails.
 */
export const resetPasswordValidator = async ({
  accessToken,
  refreshToken,
  newPassword,
}: {
  accessToken: string;
  refreshToken: string;
  newPassword: string;
}) => {
  const errors: string[] = [];

  if (!accessToken || !refreshToken) {
    errors.push("accessToken and refreshToken are required");
  }

  if (!newPassword) {
    errors.push("New password is required");
  } else if (newPassword.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    errors.push(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    );
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "));
  }
};

/**
 * Validate delete user input.
 * @param {object} params - The input object with email.
 * @throws {ValidationError} If validation fails.
 */
export const deleteUserValidator = async ({ email }: { email: string }) => {
  if (!email) {
    throw new ValidationError("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError("Invalid email format");
  }
};
