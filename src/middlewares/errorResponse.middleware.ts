import { CustomError } from "errors/customError";
import FourZeroFourError from "errors/fourZeroFourError";
import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ControllerFunction } from "types/controller";
import { ErrorResponse } from "types/response";

export class ErrorResponseMiddleware {
  static fourZeroFourError = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const error = new FourZeroFourError({
      code: StatusCodes.NOT_FOUND,
    });
    return next(error);
  };

  static errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (error instanceof CustomError) {
      const { statusCode, errors } = error;

      const customErrorResp: ErrorResponse = {
        errors,
        code: statusCode,
        isSuccess: false,
      };
      return res.status(statusCode).json(customErrorResp);
    }

    const errorResp: ErrorResponse = {
      errors: [
        {
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      ],
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      isSuccess: false,
    };

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResp);
  };

  static errorEscapeWrapper =
    (controllerFunction: ControllerFunction) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await controllerFunction(req, res, next);
      } catch (error) {
        next(error);
      }
    };
}
