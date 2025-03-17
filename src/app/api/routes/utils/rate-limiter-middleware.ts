import { getCurrentSession } from "@/lib/auth/utils";
import { Context, Next } from "hono";
import { RateLimiterMemory } from "rate-limiter-flexible";

export const rateLimiterMiddleware = (limiter: RateLimiterMemory) => {
  return async (c: Context, next: Next) => {
    try {
      const { user } = await getCurrentSession();

      if (!user) {
        await next();
        return;
      }

      const identifier = user.id;

      await limiter.consume(identifier);

      await next();
    } catch {
      return c.json(
        {
          success: false,
          message: "Przekroczono limit zapytań. Spróbuj ponownie później.",
        },
        429
      );
    }
  };
};
