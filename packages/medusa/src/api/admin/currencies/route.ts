import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@freshbox-medusa/framework/utils"
import { MedusaRequest, MedusaResponse } from "@freshbox-medusa/framework/http"
import { HttpTypes } from "@freshbox-medusa/framework/types"

export const GET = async (
  req: MedusaRequest<HttpTypes.AdminCurrencyListParams>,
  res: MedusaResponse<HttpTypes.AdminCurrencyListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "currency",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: currencies, metadata } = await remoteQuery(queryObject)

  res.json({
    currencies,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
