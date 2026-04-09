import { MedusaService, Module } from "@freshbox-medusa/framework/utils"

export default Module("module1", {
  service: class Module1Service extends MedusaService({}) {},
})
