import { MedusaStoreRequest } from "@freshbox-medusa/framework/http"
import {
  MedusaPricingContext,
  TaxCalculationContext,
} from "@freshbox-medusa/framework/types"

export type StoreRequestWithContext<
  Body,
  QueryFields = Record<string, unknown>
> = MedusaStoreRequest<Body, QueryFields> & {
  pricingContext?: MedusaPricingContext
  taxContext?: {
    taxLineContext?: TaxCalculationContext
    taxInclusivityContext?: {
      automaticTaxes: boolean
    }
  }
}
