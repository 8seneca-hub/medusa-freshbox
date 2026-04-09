import {
  MedusaContainer,
  PaymentCollectionDTO,
} from "@freshbox-medusa/framework/types"
import { refetchEntity } from "@freshbox-medusa/framework/http"

export const refetchPaymentCollection = async (
  id: string,
  scope: MedusaContainer,
  fields: string[]
): Promise<PaymentCollectionDTO> => {
  return refetchEntity({
    entity: "payment_collection",
    idOrFilter: id,
    scope,
    fields,
  })
}
