import { useEnvironment } from "@/libs/env";
import { LoginResource } from "@/resources/login";
import { initClient, initContract } from "@ts-rest/core";

const c = initContract()

const router = c.router({
  login: LoginResource
})

export const useLoginService = () => {
  const env = useEnvironment()
  return initClient(router, {
    baseUrl: env.VITE_ORIGIN_URL
  })
}
