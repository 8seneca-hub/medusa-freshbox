/**
 * Shape of a record saved in `in-memory`  cache
 */
export type CacheRecord<T> = {
  data: T
  /**
   * Timestamp in milliseconds
   */
  expire: number
}

export type InMemoryCacheModuleOptions = {
  /**
   * Time to keep data in cache (in seconds)
   */
  ttl?: number
}

declare module "@freshbox-medusa/types" {
  interface ModuleOptions {
    "@freshbox-medusa/cache-inmemory": InMemoryCacheModuleOptions
    "@freshbox-medusa/medusa/cache-inmemory": InMemoryCacheModuleOptions
  }
}
