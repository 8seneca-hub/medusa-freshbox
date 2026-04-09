import RedisLockingProvider from "@freshbox-medusa/locking-redis"

export * from "@freshbox-medusa/locking-redis"

export default RedisLockingProvider
export const discoveryPath = require.resolve("@freshbox-medusa/locking-redis")
