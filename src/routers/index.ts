import { Router } from "express";
import { chatbotRouter } from "./chatbot.router";

export const router = Router()

router.use("/", chatbotRouter)