import { updateOrderChangeWorkflow } from "@freshbox-medusa/core-flows"
import { HttpTypes, RemoteQueryFunction } from "@freshbox-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@freshbox-medusa/framework/http"
import { ContainerRegistrationKeys } from "@freshbox-medusa/framework/utils"

/**
 * @since 2.12.0
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateOrderChange,
    HttpTypes.AdminOrderChangesFilters
  >,
  res: MedusaResponse<HttpTypes.AdminOrderChangeResponse>
) => {
  const { id } = req.params
  const { carry_over_promotions } = req.validatedBody
  const query = req.scope.resolve<RemoteQueryFunction>(
    ContainerRegistrationKeys.QUERY
  )

  const workflow = updateOrderChangeWorkflow(req.scope)
  await workflow.run({
    input: {
      id,
      carry_over_promotions,
    },
  })

  const result = await query.graph({
    entity: "order_change",
    filters: {
      ...req.filterableFields,
      id,
    },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ order_change: result.data[0] })
}
