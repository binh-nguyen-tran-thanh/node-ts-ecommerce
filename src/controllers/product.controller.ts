import { NextFunction, Response } from "express";
import { CustomRequest } from "middlewares/authentication.middleware";
import { BaseResponse } from "responses/baseResponse";
import productService from "services/product.service";
import { parseToInt } from "utils";

export default class ProductController {
  static readonly addProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log("[P]::add-product::", req.body);

    return new BaseResponse({
      message: "Product created success!",
      data: await productService.createProduct({
        ...req.body,
        shop: req.shop?.userId,
      }),
    }).sendResponse(res);
  };

  static readonly getAllDraftProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log("[P]::getAllDraftProduct::", req.body);

    const limit = parseToInt(req.query.limit as string, 50);
    const skip = parseToInt(req.query.skip as string, 0);

    return new BaseResponse({
      message: "Success!",
      data: await productService.getAllDraftProduct(
        req.shop?.userId!,
        limit,
        skip
      ),
    }).sendResponse(res);
  };

  static readonly getAllPublishedProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log("[P]::getAllPublishedProduct::", req.body);

    const limit = parseToInt(req.query.limit as string, 50);
    const skip = parseToInt(req.query.skip as string, 0);

    return new BaseResponse({
      message: "Success!",
      data: await productService.getAllPublishedProduct(
        req.shop?.userId!,
        limit,
        skip
      ),
    }).sendResponse(res);
  };

  static readonly publishProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log("[P]::publishProduct::", req.body);

    return new BaseResponse({
      message: "Success!",
      data: await productService.publishProduct(
        req.shop?.userId!,
        req.body.productId
      ),
    }).sendResponse(res);
  };

  static readonly searchProductByText = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log("[G]::searchProductByText::", req.body);

    const limit = parseToInt(req.query.limit as string, 50);
    const skip = parseToInt(req.query.skip as string, 0);
    const textQuery = (req.query.query as string) ?? "";

    return new BaseResponse({
      message: "Success!",
      data: await productService.searchProductByText(textQuery, limit, skip),
    }).sendResponse(res);
  };
}
