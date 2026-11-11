const dayFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit" });
export const quotaDay = (now) => dayFormatter.format(new Date(now));

export function reserveQuota(previous, now, dailyLimit, minuteLimit) {
  const day = quotaDay(now);
  const state = { day, used: previous?.day === day ? previous.used : 0, recent: (previous?.recent || []).filter((time) => time > now - 60000) };
  if (state.used >= dailyLimit) {
    let low = now, high = now + 26 * 3600000;
    while (high - low > 1000) {
      const mid = Math.floor((low + high) / 2);
      if (quotaDay(mid) === day) low = mid; else high = mid;
    }
    return { allowed: false, code: "DAILY_QUOTA", retryAfter: Math.ceil((high - now) / 1000), state };
  }
  if (state.recent.length >= minuteLimit) return { allowed: false, code: "GLOBAL_RATE_LIMIT", retryAfter: Math.max(1, Math.ceil((state.recent[0] + 60000 - now) / 1000)), state };
  state.used += 1;
  state.recent.push(now);
  return { allowed: true, state };
}

// Single durable instance; persists counters only, never conversations or IPs.
export class GeminiQuota {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; }
  async fetch() {
    const daily = Number(this.env.GEMINI_DAILY_LIMIT);
    const minute = Number(this.env.GEMINI_MINUTE_LIMIT);
    if (!Number.isSafeInteger(daily) || daily < 1 || !Number.isSafeInteger(minute) || minute < 1) return new Response(null, { status: 503 });
    const result = await this.ctx.storage.transaction(async (tx) => {
      const result = reserveQuota(await tx.get("quota"), Date.now(), daily, minute);
      if (result.allowed) await tx.put("quota", result.state);
      return { allowed: result.allowed, code: result.code, retryAfter: result.retryAfter };
    });
    return Response.json(result);
  }
}
