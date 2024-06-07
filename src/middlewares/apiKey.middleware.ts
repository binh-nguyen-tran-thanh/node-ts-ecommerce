import { HEADER } from "constants/middlewares";
import ForbiddenError from "errors/forbidenError";
import { NextFunction, Request, Response } from "express";
import ApiKeyService from "services/apiKey.service";

class ApiKeyMiddleware {
  static readonly checkAPIKey = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.headers[HEADER.API_KEY]) return next(new ForbiddenError({}));

    const apiKey = req.headers[HEADER.API_KEY] as string;
    const keyDetail = await ApiKeyService.getActiveApiKeyDetail(apiKey);

    if (!keyDetail) return next(new ForbiddenError({}));

    return next();
  };

  static readonly checkPermissions =
    (permission: string) =>
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.headers[HEADER.API_KEY]) return next(new ForbiddenError({}));

      const apiKey = req.headers[HEADER.API_KEY] as string;
      const keyDetail = await ApiKeyService.getActiveApiKeyDetail(apiKey);

      if (!keyDetail) return next(new ForbiddenError({}));

      if (!keyDetail.permissions.includes(permission)) {
        return next(new ForbiddenError({}));
      }

      return next();
    };
}

export default ApiKeyMiddleware;
