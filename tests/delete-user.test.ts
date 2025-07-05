import { deleteUser } from "../handler";
import * as services from "../services/auth";

jest.mock("../services/auth");

describe("deleteUser handler", () => {
  it("should return success for valid email and admin", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      deleteUser: jest.fn().mockResolvedValue({ message: "deleted" }),
    }));
    const event = {
      user: { id: "admin" },
      body: JSON.stringify({ email: "a@b.com" }),
    };
    const res = await deleteUser(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return success for another valid email and admin", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      deleteUser: jest.fn().mockResolvedValue({ message: "deleted" }),
    }));
    const event = {
      user: { id: "admin2" },
      body: JSON.stringify({ email: "b@c.com" }),
    };
    const res = await deleteUser(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return error for missing email", async () => {
    const event = { user: { id: "admin" }, body: JSON.stringify({}) };
    const res = await deleteUser(event as any);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).success).toBe(false);
  });

  it("should return error if deleteUser throws", async () => {
    (services.AuthService as any).mockImplementation(() => ({
      deleteUser: jest.fn().mockRejectedValue(new Error("DB error")),
    }));
    const event = {
      user: { id: "admin" },
      body: JSON.stringify({ email: "a@b.com" }),
    };
    const res = await deleteUser(event as any);
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).success).toBe(false);
  });
});
