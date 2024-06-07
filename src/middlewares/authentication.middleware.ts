import { NextFunction, Request, Response } from "express";
import { ErrorResponseMiddleware } from "./errorResponse.middleware";
import { HEADER } from "constants/middlewares";
import UnauthorizedError from "errors/unthoraizationError";
import TokenService from "services/token.service";
import { verify, JwtPayload } from "jsonwebtoken";
import { TToken } from "models/token.model";
import { TShop } from "models/shop.model";
import { Document, Types } from "mongoose";

export interface IAddonRequest {
  tokenDetail?: Document<Types.ObjectId, unknown, TToken>;
  shop?: TShop;
  refreshToken?: string;
}

export interface CustomRequest extends Request, IAddonRequest {}

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

        if (req.headers[HEADER.REFRESH_TOKEN]) {
          try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN] as string;
            const decodedUser = verify(
              refreshToken,
              tokenDetail.privateToken as string
            ) as JwtPayload;
            if (decodedUser?.userId !== userId) {
              throw new UnauthorizedError({
                message: "Invalid Refresh Token",
              });
            }
            req.tokenDetail = tokenDetail;
            req.shop = decodedUser as TShop;
            req.refreshToken = refreshToken;
            return next();
          } catch (error) {
            return next(error);
          }
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
          req.tokenDetail = tokenDetail;
          next();
        } catch (error) {
          next(error);
        }
      }
    );
}
