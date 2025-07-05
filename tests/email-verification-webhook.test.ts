import { emailVerificationWebhook } from "../handler";
import * as services from "../services/auth";

jest.mock("../services/auth");

describe("emailVerificationWebhook handler", () => {
  it("should return success for valid email and token", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      emailVerificationWebhook: jest
        .fn()
        .mockResolvedValue({ message: "verified" }),
    }));
    const event = { body: JSON.stringify({ email: "a@b.com", token: "t1" }) };
    const res = await emailVerificationWebhook(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return success for another valid email and token", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      emailVerificationWebhook: jest
        .fn()
        .mockResolvedValue({ message: "verified" }),
    }));
    const event = { body: JSON.stringify({ email: "b@c.com", token: "t2" }) };
    const res = await emailVerificationWebhook(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return error for missing email", async () => {
    const event = { body: JSON.stringify({ token: "t1" }) };
    const res = await emailVerificationWebhook(event as any);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).success).toBe(false);
  });

  it("should return error if emailVerificationWebhook throws", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      emailVerificationWebhook: jest
        .fn()
        .mockRejectedValue(new Error("DB error")),
    }));
    const event = { body: JSON.stringify({ email: "a@b.com", token: "t1" }) };
    const res = await emailVerificationWebhook(event as any);
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).success).toBe(false);
  });
});
