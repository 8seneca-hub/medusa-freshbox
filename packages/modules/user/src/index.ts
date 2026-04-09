import { UserModuleService } from "@services"
import { Module, Modules } from "@freshbox-medusa/framework/utils"

export default Module(Modules.USER, {
  service: UserModuleService,
})
