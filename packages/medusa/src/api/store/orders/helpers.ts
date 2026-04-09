import { MedusaContainer } from "@freshbox-medusa/framework/types"
import { refetchEntity } from "@freshbox-medusa/framework/http"

export const refetchOrder = async (
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity({ entity: "order", idOrFilter, scope, fields })
}
