import { CustomerModuleService } from "@services"
import { Module, Modules } from "@freshbox-medusa/framework/utils"

export default Module(Modules.CUSTOMER, {
  service: CustomerModuleService,
})
