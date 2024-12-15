import { useEnvironment } from "@/libs/env";
import { useLocalStorage } from "@/libs/storage";
import { ListProductResource } from "@/resources/products";
import { initClient, initContract } from "@ts-rest/core";

const c = initContract()

const router = c.router({
  getProductList: ListProductResource
})

export const useProductService = () => {
  const env = useEnvironment()
  const accessToken = useLocalStorage('ACCESS_TOKEN')
  return initClient(router, {
    baseUrl: env.VITE_ORIGIN_URL,
    baseHeaders: {
      Authorization: `Bearer ${accessToken.value}`
    }
  })
}
