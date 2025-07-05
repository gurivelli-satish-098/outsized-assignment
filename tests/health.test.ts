import { health } from "../handler";

describe("health handler", () => {
  it("should return a success response (basic)", async () => {
    const event = {};
    const res = await health(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should return a success response (with extra event data)", async () => {
    const event = { extra: "data" };
    const res = await health(event as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it("should handle error if thrown (simulate error)", async () => {
    // Simulate error by mocking DatabaseContext.connect
    const originalConnect = require("../clients/mysql").default.connect;
    require("../clients/mysql").default.connect = jest
      .fn()
      .mockRejectedValue(new Error("DB error"));
    const res = await health({} as any);
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).success).toBe(false);
    require("../clients/mysql").default.connect = originalConnect;
  });

  it("should handle error if userService.checkHealth throws", async () => {
    const DatabaseContext = require("../clients/mysql").default;
    const originalConnect = DatabaseContext.connect;
    DatabaseContext.connect = jest.fn().mockResolvedValue({});
    const UserService = require("../services/users").UserService;
    jest
      .spyOn(UserService.prototype, "checkHealth")
      .mockRejectedValue(new Error("Health error"));
    const res = await health({} as any);
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).success).toBe(false);
    DatabaseContext.connect = originalConnect;
    jest.restoreAllMocks();
  });
});
