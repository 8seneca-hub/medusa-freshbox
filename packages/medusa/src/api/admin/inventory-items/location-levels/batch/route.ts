import { batchInventoryItemLevelsWorkflow } from "@freshbox-medusa/core-flows"
import { MedusaRequest, MedusaResponse } from "@freshbox-medusa/framework"
import { HttpTypes } from "@freshbox-medusa/types"

export const POST = async (
  req: MedusaRequest<HttpTypes.AdminBatchInventoryItemsLocationLevels>,
  res: MedusaResponse<HttpTypes.AdminBatchInventoryItemsLocationLevelsResponse>
) => {
  const body = req.validatedBody

  const output = await batchInventoryItemLevelsWorkflow(req.scope).run({
    input: body,
  })

  res.json({
    created: output.result.created,
    updated: output.result.updated,
    deleted: output.result.deleted,
  })
}
