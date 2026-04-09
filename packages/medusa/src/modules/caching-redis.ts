import RedisCachingProvider from "@freshbox-medusa/caching-redis"

export * from "@freshbox-medusa/caching-redis"

export default RedisCachingProvider
export const discoveryPath = require.resolve("@freshbox-medusa/caching-redis")
