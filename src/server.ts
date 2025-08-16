import { WebSocketServer } from "ws";
import { app } from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => console.log("Server running on port " + env.PORT))

// WebSocket usando o mesmo servidor
const ws = new WebSocketServer({ server })

export { ws }