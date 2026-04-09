import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@freshbox-medusa/framework/http"

import {
  StoreGetCustomerParamsType,
} from "../validators"
import { refetchCustomer } from "../helpers"
import { MedusaError } from "@freshbox-medusa/framework/utils"
import { updateCustomersWorkflow } from "@freshbox-medusa/core-flows"
import { HttpTypes } from "@freshbox-medusa/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreGetCustomerParamsType>,
  res: MedusaResponse<HttpTypes.StoreCustomerResponse>
) => {
  const id = req.auth_context.actor_id
  const customer = await refetchCustomer(id, req.scope, req.queryConfig.fields)

  if (!customer) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Customer with id: ${id} was not found`
    )
  }

  res.json({ customer })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.StoreUpdateCustomer,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.StoreCustomerResponse>
) => {
  const customerId = req.auth_context.actor_id
  await updateCustomersWorkflow(req.scope).run({
    input: {
      selector: { id: customerId },
      update: req.validatedBody,
    },
  })

  const customer = await refetchCustomer(
    customerId,
    req.scope,
    req.queryConfig.fields
  )
  res.status(200).json({ customer })
}
