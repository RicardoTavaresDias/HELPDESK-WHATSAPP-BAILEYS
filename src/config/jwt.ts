import { env } from "./env.config";

export const authConfig = {
  jwt: {
    secret: env.SECRET
  },
}