import type { IProductModuleService } from "@freshbox-medusa/framework/types"
import { Modules } from "@freshbox-medusa/framework/utils"
import { StepResponse, createStep } from "@freshbox-medusa/framework/workflows-sdk"

/**
 * The IDs of the product options to delete.
 */
export type DeleteProductOptionsStepInput = string[]

export const deleteProductOptionsStepId = "delete-product-options"
/**
 * This step deletes one or more product options.
 */
export const deleteProductOptionsStep = createStep(
  deleteProductOptionsStepId,
  async (ids: DeleteProductOptionsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.softDeleteProductOptions(ids)
    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.restoreProductOptions(prevIds)
  }
)
