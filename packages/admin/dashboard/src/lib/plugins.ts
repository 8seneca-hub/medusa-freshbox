import { HttpTypes } from "@freshbox-medusa/types"

export const LOYALTY_PLUGIN_NAME = "@freshbox-medusa/loyalty-plugin"

export const getLoyaltyPlugin = (plugins: HttpTypes.AdminPlugin[]) => {
  return plugins?.find((plugin) => plugin.name === LOYALTY_PLUGIN_NAME)
}
