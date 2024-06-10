import ShopRepository from "repositories/shop.repo";

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
    return await ShopRepository.findShop(
      {
        email,
      },
      select
    );
  };
}
