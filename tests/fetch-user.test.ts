import { fetchUser } from "../handler";
import * as services from "../services/users";

jest.mock("../services/users");

describe("fetchUser handler", () => {
  it("should return success for valid user", async () => {
    (services.UserService as any).mockImplementation(() => ({
      fetchUserById: jest.fn().mockResolvedValue({ id: "1", email: "a@b.com" }),
    }));
    const event = { user: { id: "1" } };
    const res = await fetchUser(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return success for another valid user", async () => {
    (services.UserService as any).mockImplementation(() => ({
      fetchUserById: jest.fn().mockResolvedValue({ id: "2", email: "b@c.com" }),
    }));
    const event = { user: { id: "2" } };
    const res = await fetchUser(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return error for missing user id", async () => {
    const event = { user: {} };
    const res = await fetchUser(event as any);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).success).toBe(false);
  });

  it("should return error if fetchUserById throws", async () => {
    (services.UserService as any).mockImplementation(() => ({
      fetchUserById: jest.fn().mockRejectedValue(new Error("DB error")),
    }));
    const event = { user: { id: "1" } };
    const res = await fetchUser(event as any);
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).success).toBe(false);
  });
});
