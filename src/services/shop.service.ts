import { hash } from "bcrypt";
import { randomBytes } from "crypto";

import TokenService from "./token.service";

import shopModel, { TShop } from "models/shop.model";

import { createTokenPair } from "auth/authUtils";

import { Roles } from "enums/shop";

class ShopService {
  static readonly sighUp = async ({
    email,
    name,
    password,
  }: Pick<TShop, "email" | "password" | "name">) => {
    try {
      const existingShopWithThatEmail = await shopModel
        .findOne({ email })
        .lean();
      if (existingShopWithThatEmail) {
        return {
          code: "xxx",
          message: "Duplicate Email",
          isSuccess: false,
        };
      }

      const hashedPassword = await hash(password, 10);

      const shop = await shopModel.create({
        name,
        email,
        password: hashedPassword,
        roles: [Roles.SHOP],
      });

      if (!shop) {
        return {
          code: "xxx",
          message: "Fail to create shop",
          isSuccess: false,
        };
      }

      const publicKey = randomBytes(64).toString("hex");
      const privateKey = randomBytes(64).toString("hex");

      const saveSuccess = await TokenService.saveKeyToken({
        userId: shop._id,
        publicKey,
        privateKey,
      });

      if (!saveSuccess) {
        return {
          code: "xxx",
          message: "Fail to save token",
          isSuccess: false,
        };
      }

      const tokens = await createTokenPair({
        payload: {
          userId: shop._id,
          email,
        },
        publicKey,
        privateKey,
      });

      return {
        status: 201,
        metadata: {
          shop,
          tokens,
        },
      };
    } catch (error: any) {
      return {
        code: "xxx",
        message: error.message,
        isSuccess: false,
      };
    }
  };
}

export default ShopService;
