import { productModel, TBaseProduct } from "models/product.model";
import { AddonType } from "types/common";
import { parseArrayToSelectObject, parseArrayToUnSelectObject } from "utils";
import { SortOrder } from "mongoose";

export type TProductPayload = Partial<TBaseProduct> & AddonType;

export default class ProductRepository {
  static readonly createProduct = async (payload: TProductPayload) => {
    return await productModel.create(payload);
  };

  static readonly queryDraftProduct = async (
    query: TProductPayload,
    limit = 50,
    skip = 0
  ) => {
    return await ProductRepository.queryProduct(
      { ...query, isDraft: true },
      limit,
      skip
    );
  };

  static readonly queryPublishedProduct = async (
    query: TProductPayload,
    limit = 50,
    skip = 0
  ) => {
    return await ProductRepository.queryProduct(
      { ...query, isPublished: true },
      limit,
      skip
    );
  };

  static readonly publishProduct = async (
    query: Required<Pick<TProductPayload, "shop" | "_id">>
  ) => {
    const unPublishProduct = await productModel.findOne({
      ...query,
      isDraft: true,
    });

    if (!unPublishProduct) return 0;

    unPublishProduct.isDraft = false;
    unPublishProduct.isPublished = true;

    const { modifiedCount } = await unPublishProduct.updateOne(
      unPublishProduct
    );

    return modifiedCount;
  };

  static readonly findProductByText = async (
    text: string,
    limit = 50,
    skip = 0
  ) => {
    return productModel
      .find(
        {
          $text: {
            $search: text,
          },
          isPublished: true,
        },
        {
          score: {
            $meta: "textScore",
          },
        }
      )
      .lean()
      .sort({ updateAt: -1 })
      .populate("shop", "name email -_id")
      .skip(skip)
      .limit(limit)
      .exec();
  };

  static readonly queryProduct = async (
    query: TProductPayload,
    limit = 50,
    skip = 0
  ) => {
    return await productModel
      .find(query)
      .lean()
      .sort({ updateAt: -1 })
      .populate("shop", "name email -_id")
      .skip(skip)
      .limit(limit)
      .exec();
  };

  static readonly findAllProducts = async ({
    filter,
    select,
    sort = "ctime",
    limit = 20,
    page = 1,
  }: {
    filter: Partial<TProductPayload>;
    limit: number;
    page: number;
    select: string[];
    sort: string;
  }) => {
    const skip = (page - 1) * limit;
    const selectObject = parseArrayToSelectObject(select);
    const sortObj: Record<string, SortOrder> =
      sort === "ctime" ? { _id: -1 } : { _id: 1 };

    return productModel
      .find({ ...filter, isPublished: true })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .select(selectObject)
      .lean();
  };

  static readonly findProductDetail = async ({
    id,
    unselect = [],
  }: {
    id: string;
    unselect?: string[];
  }) => {
    const select = parseArrayToUnSelectObject(unselect);
    return await productModel
      .findById(id)
      .where({
        isPublished: true,
      })
      .select(select)
      .lean();
  };
}
