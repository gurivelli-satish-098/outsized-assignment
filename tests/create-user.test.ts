import { createUser } from "../handler";
import * as services from "../services/auth";

jest.mock("../services/auth");

describe("createUser handler", () => {
  it("should return success for valid admin and user data", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      signUp: jest.fn().mockResolvedValue({ id: "1", email: "a@b.com" }),
    }));
    const event = {
      user: { id: "admin" },
      body: JSON.stringify({
        email: "a@b.com",
        password: "pass",
        role: "CUSTOMER",
      }),
    };
    const res = await createUser(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return success for another valid admin and user data", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      signUp: jest.fn().mockResolvedValue({ id: "2", email: "b@c.com" }),
    }));
    const event = {
      user: { id: "admin2" },
      body: JSON.stringify({
        email: "b@c.com",
        password: "pass2",
        role: "ADMIN",
      }),
    };
    const res = await createUser(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return error for missing email", async () => {
    const event = {
      user: { id: "admin" },
      body: JSON.stringify({ password: "pass", role: "CUSTOMER" }),
    };
    const res = await createUser(event as any);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).success).toBe(false);
  });

  it("should return error if signUp throws", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      signUp: jest.fn().mockRejectedValue(new Error("DB error")),
    }));
    const event = {
      user: { id: "admin" },
      body: JSON.stringify({
        email: "a@b.com",
        password: "pass",
        role: "CUSTOMER",
      }),
    };
    const res = await createUser(event as any);
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).success).toBe(false);
  });
});
