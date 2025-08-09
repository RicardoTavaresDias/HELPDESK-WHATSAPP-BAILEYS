import { Request, Response, NextFunction } from "express";

function userAuthorization (role: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if(!request.user){
      return response.status(403).json({ message: "Não autorizado" })
    }

    if(!role.includes(request.user.role)){
      return response.status(403).json({ message: "Não autorizado" })
    }

    return next()
  }
}

export { userAuthorization }