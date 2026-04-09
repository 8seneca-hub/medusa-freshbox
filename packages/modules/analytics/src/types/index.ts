import {
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@freshbox-medusa/framework/types"

export type AnalyticsModuleOptions = Partial<ModuleServiceInitializeOptions> & {
  /**
   * Providers to be registered
   */
  providers?: {
    /**
     * The module provider to be registered
     */
    resolve: string | ModuleProviderExports
    /**
     * The id of the provider
     */
    id: string
    /**
     * key value pair of the configuration to be passed to the provider constructor
     */
    options?: Record<string, unknown>
  }[]
}

declare module "@freshbox-medusa/types" {
  interface ModuleOptions {
    "@freshbox-medusa/analytics": AnalyticsModuleOptions
    "@freshbox-medusa/medusa/analytics": AnalyticsModuleOptions
  }
}
