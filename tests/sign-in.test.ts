import { signIn } from "../handler";
import * as services from "../services/auth";

jest.mock("../services/auth");

describe("signIn handler", () => {
  it("should return success for valid credentials", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      signIn: jest
        .fn()
        .mockResolvedValue({ user: { id: "1", email: "a@b.com" } }),
    }));
    const event = {
      body: JSON.stringify({ email: "a@b.com", password: "pass" }),
    };
    const res = await signIn(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return success for another valid credentials", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      signIn: jest
        .fn()
        .mockResolvedValue({ user: { id: "2", email: "b@c.com" } }),
    }));
    const event = {
      body: JSON.stringify({ email: "b@c.com", password: "pass2" }),
    };
    const res = await signIn(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return error for missing email", async () => {
    const event = { body: JSON.stringify({ password: "pass" }) };
    const res = await signIn(event as any);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).success).toBe(false);
  });

  it("should return error for missing password", async () => {
    const event = { body: JSON.stringify({ email: "a@b.com" }) };
    const res = await signIn(event as any);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).success).toBe(false);
  });
});
