import PostgresLockingProvider from "@freshbox-medusa/locking-postgres"

export * from "@freshbox-medusa/locking-postgres"

export default PostgresLockingProvider
export const discoveryPath = require.resolve("@freshbox-medusa/locking-postgres")
