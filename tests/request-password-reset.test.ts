import { requestPasswordReset } from "../handler";
import * as services from "../services/auth";

jest.mock("../services/auth");

describe("requestPasswordReset handler", () => {
  it("should return success for valid email", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      requestPasswordReset: jest.fn().mockResolvedValue({ message: "sent" }),
    }));
    const event = { body: JSON.stringify({ email: "a@b.com" }) };
    const res = await requestPasswordReset(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return success for another valid email", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      requestPasswordReset: jest.fn().mockResolvedValue({ message: "sent" }),
    }));
    const event = { body: JSON.stringify({ email: "b@c.com" }) };
    const res = await requestPasswordReset(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return error for missing email", async () => {
    const event = { body: JSON.stringify({}) };
    const res = await requestPasswordReset(event as any);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).success).toBe(false);
  });

  it("should return error if requestPasswordReset throws", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      requestPasswordReset: jest.fn().mockRejectedValue(new Error("DB error")),
    }));
    const event = { body: JSON.stringify({ email: "a@b.com" }) };
    const res = await requestPasswordReset(event as any);
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).success).toBe(false);
  });
});
