import express from "express"
import { router } from "@/routers"
import cors from "cors"
import { errorHandling } from "./middlewares/errorHandling"

const app = express()
app.use(express.json())

const allowedOrigins = [
  'http://localhost:3333/',
  'https://helpdesk-react-iota.vercel.app',
  'http://localhost:5173'
]

app.use(cors({
  origin: allowedOrigins
}))

app.use(router)
app.use(errorHandling)

export { app }