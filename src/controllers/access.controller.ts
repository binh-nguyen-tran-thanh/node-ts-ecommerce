import { NextFunction, Request, Response } from "express";
import shopService from "services/shop.service";

class AccessController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("[P]::sign-up::", req.body);
      return res.status(200).json(await shopService.sighUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}

export default new AccessController();
