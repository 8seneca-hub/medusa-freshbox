import { Module, Modules } from "@freshbox-medusa/framework/utils"
import { OrderModuleService } from "@services"

export default Module(Modules.ORDER, {
  service: OrderModuleService,
})
