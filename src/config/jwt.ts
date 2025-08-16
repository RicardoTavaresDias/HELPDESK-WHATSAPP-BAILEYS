import { env } from "./env";

export const authConfig = {
  jwt: {
    secret: env.SECRET
  },
}