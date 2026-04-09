import { SettingsModuleService } from "@/services"
import { Module } from "@freshbox-medusa/framework/utils"
import { Modules } from "@freshbox-medusa/utils"

export default Module(Modules.SETTINGS, {
  service: SettingsModuleService,
})
