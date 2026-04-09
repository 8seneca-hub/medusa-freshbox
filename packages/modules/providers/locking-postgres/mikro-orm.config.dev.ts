import * as entities from "./src/models"

import { defineMikroOrmCliConfig } from "@freshbox-medusa/framework/utils"

export default defineMikroOrmCliConfig("lockingPostgres", {
  entities: Object.values(entities),
})
