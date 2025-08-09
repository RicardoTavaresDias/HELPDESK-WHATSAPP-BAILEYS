import z from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  SECRET: z.string(),
  USER_DB: z.string(),
  HOST_DB: z.string(),
  DATABASE: z.string(),
  PASSWORD: z.string(),
  PORT_DB: z.coerce.number(),
})

export const env = envSchema.parse(process.env)