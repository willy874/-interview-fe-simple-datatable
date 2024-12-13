import { useEnvironment } from "@/libs/env";
import { ListProductResource } from "@/resources/products";
import { initClient, initContract } from "@ts-rest/core";

const c = initContract()

const router = c.router({
  getProductList: ListProductResource
})

export const useProductService = () => {
  const env = useEnvironment()
  return initClient(router, {
    baseUrl: env.VITE_ORIGIN_URL
  })
}
