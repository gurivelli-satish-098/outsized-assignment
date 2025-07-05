import { signUp } from "../handler";
import * as services from "../services/auth";

jest.mock("../services/auth");

describe("signUp handler", () => {
  it("should return success for valid input", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      signUp: jest
        .fn()
        .mockResolvedValue({ user: { id: "1", email: "a@b.com" } }),
    }));
    const event = {
      body: JSON.stringify({ email: "a@b.com", password: "pass" }),
    };
    const res = await signUp(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return success for another valid input", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      signUp: jest
        .fn()
        .mockResolvedValue({ user: { id: "2", email: "b@c.com" } }),
    }));
    const event = {
      body: JSON.stringify({ email: "b@c.com", password: "pass2" }),
    };
    const res = await signUp(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return error for missing email", async () => {
    const event = { body: JSON.stringify({ password: "pass" }) };
    const res = await signUp(event as any);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).success).toBe(false);
  });

  it("should return error for missing password", async () => {
    const event = { body: JSON.stringify({ email: "a@b.com" }) };
    const res = await signUp(event as any);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).success).toBe(false);
  });
});
