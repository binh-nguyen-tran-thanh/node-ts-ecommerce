import { NextFunction, Response } from "express";
import { CustomRequest } from "middlewares/authentication.middleware";
import { TProductPayload } from "repositories/product.repo";
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
    console.log("[G]::getAllDraftProduct::", req.query);

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
    console.log("[G]::getAllPublishedProduct::", req.query);

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
    console.log("[P]::publishProduct::", req.query);

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
    console.log("[G]::searchProductByText::", req.query);

    const limit = parseToInt(req.query.limit as string, 50);
    const skip = parseToInt(req.query.skip as string, 0);
    const textQuery = (req.query.query as string) ?? "";

    return new BaseResponse({
      message: "Success!",
      data: await productService.searchProductByText(textQuery, limit, skip),
    }).sendResponse(res);
  };

  static readonly getAllProducts = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log("[G]::getAllProducts::", req.query);

    const limit = parseToInt(req.query.limit as string, 50);
    const page = parseToInt(req.query.page as string, 1);
    const filter = (req.query.filter as Partial<TProductPayload>) ?? {};
    const select = (req.query.select as string[]) ?? [];
    const sort = (req.query.sort as string) ?? [];

    return new BaseResponse({
      message: "Success!",
      data: await productService.findAllProducts({
        limit,
        page,
        filter,
        select,
        sort,
      }),
    }).sendResponse(res);
  };

  static readonly getProductDetail = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log("[G]::getProductDetail::", req.params);

    const unselect = (req.query.select as string[]) ?? [];

    return new BaseResponse({
      message: "Success!",
      data: await productService.findProductDetail({
        id: req.params.productId,
        unselect: unselect,
      }),
    }).sendResponse(res);
  };

  static readonly patchUpdateProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log("[P]::updateProduct::", req.body);

    return new BaseResponse({
      message: "Update Success!",
      data: await productService.updateProduct({
        ...req.body,
        _id: req.params.productId,
        shop: req.shop?.userId,
      }),
    }).sendResponse(res);
  };
}
