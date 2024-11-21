import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateDto = (dtoClass: any) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {

      const dtoInstance = plainToInstance(dtoClass, req.body);
      

      const errors = await validate(dtoInstance);

      if (errors.length > 0) {

        console.error("Validation failed:", errors);

        const errorMessages = errors.map((e) => {

          return Object.values(e.constraints || {}).join(", ");
        });

        return res.status(400).json({
          message: "Validation failed",
          errors: errorMessages.flat(),
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
