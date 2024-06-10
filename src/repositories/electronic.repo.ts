import {
  electronicProductModel,
  TElectronicProduct,
} from "models/electronic.product.model";

export default class ElectronicProductRepository {
  static readonly createProduct = async (
    payload: Partial<TElectronicProduct>
  ) => {
    return await electronicProductModel.create(payload);
  };
}
