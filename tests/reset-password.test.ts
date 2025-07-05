import { resetPassword } from "../handler";
import * as services from "../services/auth";

jest.mock("../services/auth");

describe("resetPassword handler", () => {
  it("should return success for valid tokens and password", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      resetPassword: jest.fn().mockResolvedValue({ message: "reset" }),
    }));
    const event = {
      body: JSON.stringify({
        accessToken: "a",
        refreshToken: "b",
        newPassword: "c",
      }),
    };
    const res = await resetPassword(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return success for another valid tokens and password", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      resetPassword: jest.fn().mockResolvedValue({ message: "reset" }),
    }));
    const event = {
      body: JSON.stringify({
        accessToken: "x",
        refreshToken: "y",
        newPassword: "z",
      }),
    };
    const res = await resetPassword(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return error for missing accessToken", async () => {
    const event = {
      body: JSON.stringify({ refreshToken: "b", newPassword: "c" }),
    };
    const res = await resetPassword(event as any);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).success).toBe(false);
  });

  it("should return error if resetPassword throws", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      resetPassword: jest.fn().mockRejectedValue(new Error("DB error")),
    }));
    const event = {
      body: JSON.stringify({
        accessToken: "a",
        refreshToken: "b",
        newPassword: "c",
      }),
    };
    const res = await resetPassword(event as any);
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).success).toBe(false);
  });
});
