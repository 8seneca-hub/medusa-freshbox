import { model } from "@freshbox-medusa/utils"

export const entityModel = model.define("entityModel", {
  id: model.id().primaryKey(),
  name: model.text(),
})
