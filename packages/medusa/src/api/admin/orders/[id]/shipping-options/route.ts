import { listShippingOptionsForOrderWorkflow } from "@freshbox-medusa/core-flows"
import { MedusaRequest, MedusaResponse } from "@freshbox-medusa/framework/http"
import { AdminShippingOption, HttpTypes } from "@freshbox-medusa/framework/types"

/**
 * @since 2.10.0
 */
export const GET = async (
  req: MedusaRequest<{}, HttpTypes.AdminGetOrderShippingOptionList>,
  res: MedusaResponse<{ shipping_options: AdminShippingOption[] }>
) => {
  const { id } = req.params

  const workflow = listShippingOptionsForOrderWorkflow(req.scope)
  const { result: shipping_options } = await workflow.run({
    input: {
      order_id: id,
    },
  })

  res.json({ shipping_options })
}
