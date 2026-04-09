import {
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@freshbox-medusa/framework/types"

export const LockingDefaultProvider = "default_provider"
export const LockingIdentifiersRegistrationName = "locking_providers_identifier"

export const LockingProviderRegistrationPrefix = "lp_"

export type LockingModuleOptions = Partial<ModuleServiceInitializeOptions> & {
  /**
   * Providers to be registered
   */
  providers?: {
    /**
     * The module provider to be registered
     */
    resolve: string | ModuleProviderExports
    /**
     * If the provider is the default
     */
    is_default?: boolean
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
    "@freshbox-medusa/locking": LockingModuleOptions
    "@freshbox-medusa/medusa/locking": LockingModuleOptions
  }
}
