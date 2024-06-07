import { NextFunction, Request, Response } from "express";
import { ErrorResponseMiddleware } from "./errorResponse.middleware";
import { HEADER } from "constants/middlewares";
import UnauthorizedError from "errors/unthoraizationError";
import TokenService from "services/token.service";
import { verify, JwtPayload } from "jsonwebtoken";
import { TToken } from "models/token.model";

export interface CustomRequest extends Request {
  tokenDetail?: TToken;
}

export default class AuthenticationMiddleware {
  static readonly checkAuthentication =
    ErrorResponseMiddleware.errorEscapeWrapper(
      async (req: CustomRequest, res: Response, next: NextFunction) => {
        const userId = req.headers[HEADER.CLIENT_ID] as string;
        if (!userId) {
          throw new UnauthorizedError({
            message: "Invalid user id",
          });
        }

        const tokenDetail = await TokenService.findByUserId(userId);
        if (!tokenDetail) {
          throw new UnauthorizedError({
            message: "Invalid user",
          });
        }

        const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
        if (!accessToken) {
          throw new UnauthorizedError({
            message: "Invalid token",
          });
        }

        try {
          const decoded = verify(
            accessToken,
            tokenDetail.publicToken as string
          ) as JwtPayload;
          if (decoded?.userId !== userId) {
            throw new UnauthorizedError({
              message: "Invalid token",
            });
          }
          req.tokenDetail = tokenDetail as TToken;
          next();
        } catch (error) {
          next(error);
        }
      }
    );
}
