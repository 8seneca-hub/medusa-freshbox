import { ContainerLike } from "@freshbox-medusa/framework"
import { Logger } from "@freshbox-medusa/framework/types"
import { FlowCancelOptions } from "@freshbox-medusa/framework/workflows-sdk"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export type WorkflowOrchestratorCancelOptions = Omit<
  FlowCancelOptions,
  "transaction" | "transactionId" | "container"
> & {
  transactionId: string
  container?: ContainerLike
}
