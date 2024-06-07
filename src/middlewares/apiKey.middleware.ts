import { HEADER } from "constants/middlewares";
import { NextFunction, Request, Response } from "express";
import ApiKeyService from "services/apiKey.service";

class ApiKeyMiddleware {
  static readonly checkAPIKey = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.headers[HEADER.API_KEY])
      return res.status(403).json({
        message: "Un-authorization error",
      });

    const apiKey = req.headers[HEADER.API_KEY] as string;
    const keyDetail = await ApiKeyService.getActiveApiKeyDetail(apiKey);

    if (!keyDetail)
      return res.status(403).json({
        message: "Un-authorization error",
      });

    return next();
  };

  static readonly checkPermissions =
    (permission: string) =>
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.headers[HEADER.API_KEY])
        return res.status(403).json({
          message: "Un-authorization error",
        });

      const apiKey = req.headers[HEADER.API_KEY] as string;
      const keyDetail = await ApiKeyService.getActiveApiKeyDetail(apiKey);

      if (!keyDetail)
        return res.status(403).json({
          message: "Un-authorization error",
        });

      if (!keyDetail.permissions.includes(permission)) {
        return res.status(403).json({
          message: "Permission denied",
        });
      }

      return next();
    };
}

export default ApiKeyMiddleware;
