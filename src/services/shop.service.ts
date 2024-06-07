import shopModel from "models/shop.model";

export default class ShopService {
  static readonly findShopByEmail = async (
    email: string,
    select: Record<string, number> = {
      email: 1,
      password: 1,
      name: 1,
      status: 1,
      roles: 1,
    }
  ) => {
    const shop = shopModel.findOne({ email }).select(select).lean();
    return shop;
  };
}
