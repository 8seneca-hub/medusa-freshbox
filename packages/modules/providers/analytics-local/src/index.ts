import { ModuleProvider, Modules } from "@freshbox-medusa/framework/utils"
import { LocalAnalyticsService } from "./services/local-analytics"

const services = [LocalAnalyticsService]

export default ModuleProvider(Modules.ANALYTICS, {
  services,
})
