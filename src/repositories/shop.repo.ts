import shopModel, { TShop } from "models/shop.model";
import { AddonType } from "types/common";

export default class ShopRepository {
  static readonly findShop = async (
    query: Partial<TShop>,
    select: Record<string, number> = {}
  ) => {
    return await shopModel.findOne(query).select(select).lean();
  };

  static readonly createShop = async (data: Partial<TShop> & AddonType) => {
    return await shopModel.create(data);
  };
}
