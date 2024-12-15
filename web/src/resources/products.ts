import { z } from 'zod'
import { type AppRouteQuery } from '@ts-rest/core'
import { HTTPErrorResponseDTOSchema, HTTPValidationErrorResponseDTOSchema } from '@/libs/api'

const ProductSchema = z.object({
  name: z.string(),
  stock: z.number(),
  price: z.number(),
})

export type ProductModel = z.infer<typeof ProductSchema>

const ListProductRequestDTOSchema = z.object({
  q: z.string().min(2).optional(), // key word search
  p: z.number().optional(), // page
  sort_by: z.union([
    z.literal('name'),
    z.literal('stock'),
    z.literal('price')
  ]).optional(),
  order_by: z.union([z.literal('asc'), z.literal('desc')]).optional(),
  page_size: z.number().optional(),
})

export type ListProductRequestDTO = z.infer<typeof ListProductRequestDTOSchema>

const ListProductResponseDTOSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
})

export const ListProductResource = {
  path: '/products',
  method: 'GET',
  query: ListProductRequestDTOSchema,
  responses: {
    200: ListProductResponseDTOSchema,
    400: HTTPErrorResponseDTOSchema,
    403: HTTPErrorResponseDTOSchema,
    422: HTTPValidationErrorResponseDTOSchema
  }
} as const satisfies AppRouteQuery
