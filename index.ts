import { Hono, Context, Env } from "hono";
import { BlankInput } from "hono/types";
import { env } from "hono/adapter";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import data from "./data.json";

const app = new Hono();
declare module "hono" {
  interface ContextVariableMap {
    ratelimit: Ratelimit;
  }
}
const cache = new Map();
class RedisRateLimiter {
  static Instance: Ratelimit;
  static getInstance(c: Context<Env, "/todos/:id", BlankInput>) {
    if (!this.Instance) {
      const { REST_URL, REST_TOKEN } = env<{
        REST_URL: string;
        REST_TOKEN: string;
      }>(c);

      const redisClient = new Redis({
        token: REST_TOKEN,
        url: REST_URL,
      });

      const ratelimit = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        ephemeralCache: cache,
      });

      this.Instance = ratelimit;
      return this.Instance;
    } else {
      return this.Instance;
    }
  }
}

app.use(async (c, next) => {
  try {
    const ratelimit = RedisRateLimiter.getInstance(c);

    c.set("ratelimit", ratelimit);
    return await next();
  } catch (error) {
    console.log("error", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.get("/todos/:id", async (c) => {
  try {
    const ratelimit = c.get("ratelimit");
    const ip = c.req.raw.headers.get("CF-CONNECTING-IP");

    const { success } = await ratelimit.limit(ip ?? "anonymous");
    if (success) {
      const params = c.req.param("id");
      const id = Number(params);

      const todo = data.find((todo) => todo.id === id);
      return c.json(todo);
    } else {
      return c.json({ message: "Rate limit exceeded" }, 429);
    }
  } catch (error) {
    console.log(error);
  }
});

export default app;
