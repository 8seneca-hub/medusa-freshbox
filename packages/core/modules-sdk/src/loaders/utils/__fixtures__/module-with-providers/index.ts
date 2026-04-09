import { ModuleExports } from "@freshbox-medusa/types"
import { ModuleService } from "./services/module-service"
import { Module } from "@freshbox-medusa/utils"

const moduleExports: ModuleExports = {
  service: ModuleService,
}

export * from "./services/module-service"

export default Module("module-with-providers", moduleExports)
