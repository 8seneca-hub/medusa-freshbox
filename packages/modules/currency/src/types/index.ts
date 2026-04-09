import { IEventBusModuleService, Logger } from "@freshbox-medusa/framework/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  EventBus?: IEventBusModuleService
}
