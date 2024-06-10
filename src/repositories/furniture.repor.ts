import {
  furnitureProductModel,
  TFurnitureProduct,
} from "models/furniture.product.model";

export default class FurnitureProductRepository {
  static readonly createProduct = async (
    payload: Partial<TFurnitureProduct>
  ) => {
    return await furnitureProductModel.create(payload);
  };
}
