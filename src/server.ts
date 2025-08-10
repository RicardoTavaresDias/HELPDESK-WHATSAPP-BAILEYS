import { app } from "./app";
import { env } from "./config/env.config";
import  bootWhatsappBaileys  from "@/services/whatsapp.services"

// Inicializa Whatapp junto com servidor
async function start() {
  await bootWhatsappBaileys.initial()
}

start()

app.listen(env.PORT, () => console.log("Server running on port " + env.PORT));