import { StoreModuleService } from "@services"
import { Module, Modules } from "@freshbox-medusa/framework/utils"

export default Module(Modules.STORE, {
  service: StoreModuleService,
})
