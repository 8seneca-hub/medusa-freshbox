import { defineMikroOrmCliConfig } from "@freshbox-medusa/framework/utils"
import * as entities from "./src/models"

export default defineMikroOrmCliConfig("rbac", {
  entities: Object.values(entities),
})
