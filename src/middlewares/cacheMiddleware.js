import { getCache, setCache } from "../utils/redis.js";

// Cache middleware untuk GET requests
export const cacheMiddleware = (options = {}) => {
  return async (req, res, next) => {
    // Hanya cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = options.key || `route:${req.originalUrl}`;
    const ttl = options.ttl || 3600; // Default 1 hour

    try {
      // Try to get from cache
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        // Set header SEBELUM res.json()
        res.setHeader("X-Data-Source", "cache");
        return res.json(cachedData);
      }
    } catch (err) {
      console.error("Cache error:", err);
      // Continue if cache fails
    }

    // Set header untuk database response
    res.setHeader("X-Data-Source", "database");

    // Override res.json untuk cache response
    const originalJson = res.json.bind(res);
    res.json = function (data) {
      // Cache successful responses (status < 400)
      if (res.statusCode < 400) {
        setCache(cacheKey, data, ttl).catch((err) =>
          console.error("Error caching response:", err),
        );
      }
      return originalJson(data);
    };

    next();
  };
};

export default cacheMiddleware;
