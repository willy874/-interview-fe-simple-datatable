import { z } from 'zod'
import { type AppRouteMutation } from '@ts-rest/core'
import { HTTPErrorResponseDTOSchema, HTTPValidationErrorResponseDTOSchema } from '@/libs/api'

const LoginRequestDTOSchema = z.object({
  username: z.string(),
  password: z.string(),
})

const LoginResponseDTOSchema = z.object({
  token: z.string(),
})


export const LoginResource = {
  path: '/login',
  method: 'POST',
  body: LoginRequestDTOSchema,
  responses: {
    200: LoginResponseDTOSchema,
    400: HTTPErrorResponseDTOSchema,
    422: HTTPValidationErrorResponseDTOSchema
  }
} as const satisfies AppRouteMutation
