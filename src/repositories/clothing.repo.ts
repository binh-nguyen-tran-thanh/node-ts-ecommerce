import {
  clothingProductModel,
  TClothingProduct,
} from "models/clothing.product.model";

export default class ClothingProductRepository {
  static readonly createProduct = async (
    payload: Partial<TClothingProduct>
  ) => {
    return await clothingProductModel.create(payload);
  };
}
