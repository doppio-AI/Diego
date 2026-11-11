import test from "node:test";
import assert from "node:assert/strict";
import { reserveQuota, quotaDay, GeminiQuota } from "./quota.js";
import worker from "./index.js";

test("daily cap survives minute resets and releases at Pacific midnight", () => {
  const now = Date.parse("2026-11-12T07:55:00Z");
  let result = reserveQuota(null, now, 2, 12);
  result = reserveQuota(result.state, now + 61000, 2, 12);
  assert.equal(reserveQuota(result.state, now + 122000, 2, 12).code, "DAILY_QUOTA");
  assert.equal(reserveQuota(result.state, Date.parse("2026-11-12T08:00:00Z"), 2, 12).allowed, true);
});
test("rolling minute has no fixed-window burst loophole", () => {
  let r = reserveQuota(null, 59000, 450, 2);
  r = reserveQuota(r.state, 60000, 450, 2);
  assert.equal(reserveQuota(r.state, 61000, 450, 2).code, "GLOBAL_RATE_LIMIT");
  assert.equal(reserveQuota(r.state, 119000, 450, 2).allowed, true);
});
test("Pacific day boundary respects daylight saving", () => {
  assert.notEqual(quotaDay(Date.parse("2026-07-02T06:59:59Z")), quotaDay(Date.parse("2026-07-02T07:00:00Z")));
  const now = Date.parse("2026-11-01T07:00:00Z");
  const r = reserveQuota({ day: quotaDay(now), used: 450, recent: [] }, now, 450, 12);
  assert.ok(r.retryAfter >= 90000 && r.retryAfter <= 90001);
});
test("reservations persist between object instances", async () => {
  const data = new Map();
  const ctx = { storage: { transaction: async (fn) => fn({ get: async (key) => data.get(key), put: async (key, value) => data.set(key, value) }) } };
  const env = { GEMINI_DAILY_LIMIT: "1", GEMINI_MINUTE_LIMIT: "12" };
  assert.equal((await (await new GeminiQuota(ctx, env).fetch()).json()).allowed, true);
  assert.equal((await (await new GeminiQuota(ctx, env).fetch()).json()).code, "DAILY_QUOTA");
});
test("exhausted or unavailable quota never calls Gemini", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error("must not run"); };
  const env = { ALLOWED_ORIGIN: "https://doppio-ai.github.io", GEMINI_API_KEY: "test", CHAT_RATE_LIMITER: { limit: async () => ({ success: true }) }, GEMINI_QUOTA: { idFromName: (x) => x, get: () => ({ fetch: async () => Response.json({ allowed: false, code: "DAILY_QUOTA", retryAfter: 100 }) }) } };
  const request = () => new Request("https://test.example", { method: "POST", headers: { Origin: env.ALLOWED_ORIGIN, "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1" }, body: JSON.stringify({ messages: [{ role: "user", content: "Hola" }] }) });
  try {
    const blocked = await worker.fetch(request(), env);
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.get("Retry-After"), "100");
    assert.equal((await worker.fetch(request(), { ...env, GEMINI_QUOTA: undefined })).status, 502);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = original; }
});
