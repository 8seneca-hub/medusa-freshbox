import { CreateApiKeyDTO } from "@types"
import { ApiKeyType } from "@freshbox-medusa/framework/utils"

export const createSecretKeyFixture: CreateApiKeyDTO = {
  title: "Secret key",
  type: ApiKeyType.SECRET,
  created_by: "test",
}

export const createPublishableKeyFixture: CreateApiKeyDTO = {
  title: "Test API Key",
  type: ApiKeyType.PUBLISHABLE,
  created_by: "test",
}
