import { Router } from "express";
import { ChatbotController } from "@/controllers/chatbot.controller"
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { userAuthorization } from "@/middlewares/userAuthorization";

export const chatbotRouter = Router()
const chatbotController = new ChatbotController()

//chatbotRouter.use(ensureAuthenticated)
chatbotRouter.get("/", chatbotController.get)
chatbotRouter.get("/show", chatbotController.show)