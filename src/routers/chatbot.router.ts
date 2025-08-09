import { Router } from "express";
import { ChatbotController } from "@/controllers/controller"
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { userAuthorization } from "@/middlewares/userAuthorization";

export const chatbotRouter = Router()
const chatbotController = new ChatbotController()

chatbotRouter.use(ensureAuthenticated)
chatbotRouter.get("/", userAuthorization([ "admin", "technical" ]), chatbotController.get)