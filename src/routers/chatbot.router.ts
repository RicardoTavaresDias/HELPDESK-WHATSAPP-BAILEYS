import { Router } from "express";
import { ChatbotController } from "@/controllers/controller"

export const chatbotRouter = Router()
const chatbotController = new ChatbotController()

chatbotRouter.get("/", chatbotController.get)