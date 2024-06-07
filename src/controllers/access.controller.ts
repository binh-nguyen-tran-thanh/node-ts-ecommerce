import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "middlewares/authentication.middleware";
import { BaseResponse } from "responses/baseResponse";
import accessService from "services/access.service";

class AccessController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    console.log("[P]::sign-up::", req.body);

    return new BaseResponse({
      message: "Shop created success!",
      data: await accessService.sighUp(req.body),
    }).sendResponse(res);
  };
  signIn = async (req: Request, res: Response, next: NextFunction) => {
    console.log("[P]::sign-in::", req.body);

    return new BaseResponse({
      message: "Logged In",
      data: await accessService.signIn(req.body),
    }).sendResponse(res);
  };

  signOut = async (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log("[P]::sign-out::", req.tokenDetail);

    return new BaseResponse({
      message: "Logged out",
      data: await accessService.signOut(req.tokenDetail?.user.toString()!),
    }).sendResponse(res);
  };
}

export default new AccessController();
