import { IModuleService, ModuleJoinerConfig } from "@freshbox-medusa/types"
import { defineJoinerConfig } from "@freshbox-medusa/utils"

export class ModuleService implements IModuleService {
  __joinerConfig(): ModuleJoinerConfig {
    return defineJoinerConfig("module-service", {
      alias: [
        {
          name: ["custom_name"],
          entity: "Custom",
        },
      ],
    })
  }
}
