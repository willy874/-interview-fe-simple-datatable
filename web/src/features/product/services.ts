import { useEnvironment } from "@/libs/env";
import { useLocalStorage } from "@/libs/storage";
import { ListProductResource, type ListProductRequestDTO } from "@/resources/products";
import { initClient, initContract } from "@ts-rest/core";
import { useRouter } from "vue-router";

const c = initContract()

const router = c.router({
  getProductList: ListProductResource
})

const useProductService = () => {
  const env = useEnvironment()
  const accessToken = useLocalStorage('ACCESS_TOKEN')
  return initClient(router, {
    baseUrl: env.VITE_ORIGIN_URL,
    baseHeaders: {
      Authorization: `Bearer ${accessToken.value}`
    },
  })
}

export const useLogout = () => {
  const router = useRouter()
  const accessToken = useLocalStorage('ACCESS_TOKEN')
  return (to = '/login') => {
    accessToken.value = ''
    router.push(to)
  }
}

export const useGetProductList = () => {
  const service = useProductService()
  const logout = useLogout()
  return (dto: ListProductRequestDTO) => {
    return service.getProductList({ query: dto }).then((res) => {
      if (res.status === 200) {
        return res
      }
      if (res.status === 400) {
        return Promise.reject(res)
      }
      if (res.status === 403) {
        logout()
        return Promise.reject(res)
      }
      if (res.status === 422) {
        return Promise.reject(res)
      }
      throw new Error('Invalid status code')
    })
  }
}
