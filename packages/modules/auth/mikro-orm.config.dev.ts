import * as entities from "./src/models"
import { defineMikroOrmCliConfig, Modules } from "@freshbox-medusa/framework/utils"

export default defineMikroOrmCliConfig(Modules.AUTH, {
  entities: Object.values(entities),
})
