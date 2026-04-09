import { cancelOrderFulfillmentWorkflow } from "@freshbox-medusa/core-flows"
import { AdditionalData, HttpTypes } from "@freshbox-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@freshbox-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@freshbox-medusa/framework/http"
import { AdminOrderCancelFulfillmentType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    AdminOrderCancelFulfillmentType & AdditionalData
  >,
  res: MedusaResponse<HttpTypes.AdminOrderResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = { id: req.params.id }

  const input = {
    ...req.validatedBody,
    order_id: req.params.id,
    fulfillment_id: req.params.fulfillment_id,
    canceled_by: req.auth_context.actor_id,
  }

  await cancelOrderFulfillmentWorkflow(req.scope).run({
    input,
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables,
    fields: req.queryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)
  res.status(200).json({ order })
}
