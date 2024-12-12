import { z } from "zod";

export const HTTPErrorResponseDTOSchema = z.object({
  detail: z.string(),
})

const HTTPValidationErrorDetailSchema = z.object({
  loc: z.array(z.union([z.string(), z.number()])),
  msg: z.string(),
  type: z.string(),
  input: z.string().optional(),
  ctx: z.record(z.unknown()).optional(),
})

export const HTTPValidationErrorResponseDTOSchema = z.object({
  detail: z.array(HTTPValidationErrorDetailSchema),
})
