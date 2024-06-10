import { NextFunction, Response } from "express";
import { CustomRequest } from "middlewares/authentication.middleware";
import { BaseResponse } from "responses/baseResponse";
import productService from "services/product.service";

export default class ProductController {
  static addProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log("[P]::add-product::", req.body);

    return new BaseResponse({
      message: "Product created success!",
      data: await productService.createProduct({
        ...req.body,
        shop: req.shop?.email,
      }),
    }).sendResponse(res);
  };
}
