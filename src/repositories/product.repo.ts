import { query } from "express";
import { productModel, TBaseProduct } from "models/product.model";
import { AddonType } from "types/common";

type TProductPayload = Partial<TBaseProduct> & AddonType;

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
}
