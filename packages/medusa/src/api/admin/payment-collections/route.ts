import { createOrderPaymentCollectionWorkflow } from "@freshbox-medusa/core-flows"
import { HttpTypes } from "@freshbox-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@freshbox-medusa/framework/http"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreatePaymentCollection,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminPaymentCollectionResponse>
) => {
  const { result } = await createOrderPaymentCollectionWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  const paymentCollection = await refetchEntity({
    entity: "payment_collection",
    idOrFilter: result[0].id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ payment_collection: paymentCollection })
}
