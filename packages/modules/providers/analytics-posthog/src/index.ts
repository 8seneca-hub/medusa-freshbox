import { ModuleProvider, Modules } from "@freshbox-medusa/framework/utils"
import { PosthogAnalyticsService } from "./services/posthog-analytics"

const services = [PosthogAnalyticsService]

export default ModuleProvider(Modules.ANALYTICS, {
  services,
})
