import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken"
import { authConfig } from "@/config/jwt"

function ensureAuthenticated (request: Request, response: Response, next: NextFunction) {
   try {
    const authHeader = request.headers.authorization
    if(!authHeader) return response.status(401).json({ message: "Token JWT não encontrado" })

    const token = authHeader.split(" ")[1]
    //@ts-ignore
    const { user } = verify(token, authConfig.jwt.secret)

    request.user = {
      role: user.role
    }
    
    next()
  } catch(error){
    response.status(401).json({ message: "Token JWT inválido" })
  }
}

export { ensureAuthenticated }