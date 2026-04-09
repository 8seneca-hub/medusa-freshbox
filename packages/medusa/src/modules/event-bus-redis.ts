import RedisEventBusModule from "@freshbox-medusa/event-bus-redis"

export * from "@freshbox-medusa/event-bus-redis"

export default RedisEventBusModule
export const discoveryPath = require.resolve("@freshbox-medusa/event-bus-redis")
