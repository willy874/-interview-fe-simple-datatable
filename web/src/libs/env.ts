import { inject } from "vue"
import type { App } from "vue"
import { z } from "zod"

const EnvironmentSchema = z.object({
  VITE_ORIGIN_URL: z.string(),
})

export const envPlugin = {
  install: (app: App) => {
    app.provide('env', import.meta.env)
  }
}

export const useEnvironment = () => {
  const env = inject('env')
  return EnvironmentSchema.parse(env)
}
