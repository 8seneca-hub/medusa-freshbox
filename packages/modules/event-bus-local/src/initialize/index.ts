import { MedusaModule } from "@freshbox-medusa/framework/modules-sdk"
import { IEventBusService } from "@freshbox-medusa/framework/types"
import { Modules } from "@freshbox-medusa/framework/utils"

export const initialize = async (): Promise<IEventBusService> => {
  const serviceKey = Modules.EVENT_BUS
  const loaded = await MedusaModule.bootstrap<IEventBusService>({
    moduleKey: serviceKey,
    defaultPath: "@freshbox-medusa/event-bus-local",
  })

  return loaded[serviceKey]
}
