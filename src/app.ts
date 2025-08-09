import express from "express"
import { router } from "@/routers"
import cors from "cors"
import { errorHandling } from "./middlewares/errorHandling"

const app = express()
app.use(express.json())
app.use(router)
app.use(cors())
app.use(errorHandling)

export { app }