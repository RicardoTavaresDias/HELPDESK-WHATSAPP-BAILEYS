import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod/v4";

function errorHandling (error: any, request: Request, response: Response, next: NextFunction) {
  if(error instanceof ZodError) {
    return response.status(400).json({ message: "validation error",  issues: error.format() })
  }

  response.status(500).json({ message: error.message })
}

export { errorHandling }