import RedisCacheModule from "@freshbox-medusa/cache-redis"

export * from "@freshbox-medusa/cache-redis"

export default RedisCacheModule
export const discoveryPath = require.resolve("@freshbox-medusa/cache-redis")
