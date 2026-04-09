export const Modules = {
  ANALYTICS: "analytics",
  AUTH: "auth",
  CACHE: "cache",
  CART: "cart",
  CUSTOMER: "customer",
  EVENT_BUS: "event_bus",
  INVENTORY: "inventory",
  LINK: "link_modules",
  PAYMENT: "payment",
  PRICING: "pricing",
  PRODUCT: "product",
  PROMOTION: "promotion",
  SALES_CHANNEL: "sales_channel",
  TAX: "tax",
  FULFILLMENT: "fulfillment",
  STOCK_LOCATION: "stock_location",
  USER: "user",
  WORKFLOW_ENGINE: "workflows",
  REGION: "region",
  ORDER: "order",
  API_KEY: "api_key",
  STORE: "store",
  CURRENCY: "currency",
  FILE: "file",
  NOTIFICATION: "notification",
  INDEX: "index",
  LOCKING: "locking",
  SETTINGS: "settings",
  CACHING: "caching",
  TRANSLATION: "translation",
  RBAC: "rbac",
} as const

export const MODULE_PACKAGE_NAMES = {
  [Modules.ANALYTICS]: "@freshbox-medusa/medusa/analytics",
  [Modules.AUTH]: "@freshbox-medusa/medusa/auth",
  [Modules.CACHE]: "@freshbox-medusa/medusa/cache-inmemory",
  [Modules.CART]: "@freshbox-medusa/medusa/cart",
  [Modules.CUSTOMER]: "@freshbox-medusa/medusa/customer",
  [Modules.EVENT_BUS]: "@freshbox-medusa/medusa/event-bus-local",
  [Modules.INVENTORY]: "@freshbox-medusa/medusa/inventory",
  [Modules.LINK]: "@freshbox-medusa/medusa/link-modules",
  [Modules.PAYMENT]: "@freshbox-medusa/medusa/payment",
  [Modules.PRICING]: "@freshbox-medusa/medusa/pricing",
  [Modules.PRODUCT]: "@freshbox-medusa/medusa/product",
  [Modules.PROMOTION]: "@freshbox-medusa/medusa/promotion",
  [Modules.SALES_CHANNEL]: "@freshbox-medusa/medusa/sales-channel",
  [Modules.FULFILLMENT]: "@freshbox-medusa/medusa/fulfillment",
  [Modules.STOCK_LOCATION]: "@freshbox-medusa/medusa/stock-location",
  [Modules.TAX]: "@freshbox-medusa/medusa/tax",
  [Modules.USER]: "@freshbox-medusa/medusa/user",
  [Modules.WORKFLOW_ENGINE]: "@freshbox-medusa/medusa/workflow-engine-inmemory",
  [Modules.REGION]: "@freshbox-medusa/medusa/region",
  [Modules.ORDER]: "@freshbox-medusa/medusa/order",
  [Modules.API_KEY]: "@freshbox-medusa/medusa/api-key",
  [Modules.STORE]: "@freshbox-medusa/medusa/store",
  [Modules.CURRENCY]: "@freshbox-medusa/medusa/currency",
  [Modules.FILE]: "@freshbox-medusa/medusa/file",
  [Modules.NOTIFICATION]: "@freshbox-medusa/medusa/notification",
  [Modules.INDEX]: "@freshbox-medusa/medusa/index-module",
  [Modules.LOCKING]: "@freshbox-medusa/medusa/locking",
  [Modules.SETTINGS]: "@freshbox-medusa/medusa/settings",
  [Modules.CACHING]: "@freshbox-medusa/medusa/caching",
  [Modules.TRANSLATION]: "@freshbox-medusa/medusa/translation",
  [Modules.RBAC]: "@freshbox-medusa/medusa/rbac",
}

export const REVERSED_MODULE_PACKAGE_NAMES = Object.entries(
  MODULE_PACKAGE_NAMES
).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {})

// TODO: temporary fix until the event bus, cache and workflow engine are migrated to use providers and therefore only a single resolution will be good
export const TEMPORARY_REDIS_MODULE_PACKAGE_NAMES = {
  [Modules.EVENT_BUS]: "@freshbox-medusa/medusa/event-bus-redis",
  [Modules.CACHE]: "@freshbox-medusa/medusa/cache-redis",
  [Modules.WORKFLOW_ENGINE]: "@freshbox-medusa/medusa/workflow-engine-redis",
  [Modules.LOCKING]: "@freshbox-medusa/medusa/locking-redis",
}

REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.EVENT_BUS]
] = Modules.EVENT_BUS
REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.CACHE]
] = Modules.CACHE
REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.WORKFLOW_ENGINE]
] = Modules.WORKFLOW_ENGINE
REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.LOCKING]
] = Modules.LOCKING

/**
 * Making modules be referenced as a type as well.
 */
export type Modules = (typeof Modules)[keyof typeof Modules]
export const ModuleRegistrationName = Modules
