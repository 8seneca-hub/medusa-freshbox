import "@freshbox-medusa/utils"
export * from "@freshbox-medusa/types"

import type { ModuleOptions as ModuleOptionsType } from "@freshbox-medusa/types"

// Re-declare ModuleOptions to enable augmentation from @freshbox-medusa/framework/types
// EventBusEventsOptions is exported via "export *" and gets augmentations from @freshbox-medusa/utils
export interface ModuleOptions extends ModuleOptionsType {}
