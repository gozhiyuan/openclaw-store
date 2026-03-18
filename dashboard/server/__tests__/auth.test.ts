import { describe, it, expect } from "vitest";
import { createAuthHook } from "../middleware/auth.js";

describe("auth middleware", () => {
  it("returns null hook when no token configured", () => {
    const hook = createAuthHook(undefined);
    expect(hook).toBeNull();
  });

  it("returns a hook function when token is set", () => {
    const hook = createAuthHook("secret");
    expect(typeof hook).toBe("function");
  });

  it("returns null for empty string token", () => {
    const hook = createAuthHook("");
    expect(hook).toBeNull();
  });
});
