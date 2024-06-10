import { hash, compare } from "bcrypt";
import { randomBytes } from "crypto";
import { Roles } from "enums/shop";
import BadRequestError from "errors/badRequestError";
import { TShop } from "models/shop.model";
import TokenService from "./token.service";
import { createTokenPair } from "auth/authUtils";
import ShopService from "./shop.service";
import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { transferToViewObject } from "utils";
import { IAddonRequest } from "middlewares/authentication.middleware";
import ShopRepository from "repositories/shop.repo";

export default class AccessService {
  private static readonly _generateTokens = async (
    userId: Types.ObjectId,
    email: string
  ) => {
    const publicKey = randomBytes(64).toString("hex");
    const privateKey = randomBytes(64).toString("hex");

    const tokens = await createTokenPair({
      payload: {
        userId,
        email,
      },
      publicKey,
      privateKey,
    });

    const saveSuccess = await TokenService.saveKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens?.refreshToken!,
    });

    if (!saveSuccess) {
      throw new BadRequestError({
        message: "Save token Failed",
      });
    }

    return tokens;
  };

  static readonly sighUp = async ({
    email,
    name,
    password,
  }: Pick<TShop, "email" | "password" | "name">) => {
    const existingShopWithThatEmail = await ShopRepository.findShop({ email });
    if (existingShopWithThatEmail) {
      throw new BadRequestError({
        message: "Shop email address is existed",
      });
    }

    const hashedPassword = await hash(password, 10);

    const shop = await ShopRepository.createShop({
      name,
      email,
      password: hashedPassword,
      roles: [Roles.SHOP] as any,
    });

    if (!shop) {
      throw new BadRequestError({
        message: "Fail to create shop",
      });
    }

    const tokens = await this._generateTokens(shop._id, email);

    return {
      shop: transferToViewObject(shop, [
        "name",
        "email",
        "roles",
        "status",
        "verify",
      ]),
      tokens,
    };
  };

  static readonly signIn = async ({
    email,
    password,
  }: Pick<TShop, "email" | "password">) => {
    const existedShop = await ShopService.findShopByEmail(email);
    if (!existedShop) {
      throw new BadRequestError({
        code: StatusCodes.UNAUTHORIZED,
        message: "Login Failed. Please check your credentials",
      });
    }

    const isMatchPassword = await compare(
      password,
      existedShop.password! as string
    );

    if (!isMatchPassword) {
      throw new BadRequestError({
        code: StatusCodes.UNAUTHORIZED,
        message: "Login Failed. Please check your credentials",
      });
    }

    const tokens = await this._generateTokens(existedShop._id, email);

    return {
      ...tokens,
    };
  };

  static readonly signOut = async (userId: string) => {
    const deleteState = await TokenService.deleteByUserId(userId);

    return deleteState;
  };

  static readonly refreshToken = async ({
    refreshToken,
    shop,
    tokenDetail,
  }: IAddonRequest) => {
    const tokenDetailObj = tokenDetail?.toObject();
    if (tokenDetailObj?.refreshTokensUsed?.includes(refreshToken)) {
      await TokenService.deleteAllById(tokenDetailObj._id.toString());
      throw new BadRequestError({
        message: "Something go wrong with your account. Please re-login",
      });
    }

    if (tokenDetail?.get("refreshToken") !== refreshToken) {
      throw new BadRequestError({
        message: "Invalid refresh token",
      });
    }

    const existedShop = await ShopService.findShopByEmail(shop?.email!);

    if (!existedShop) {
      throw new BadRequestError({
        message: "Shop not found",
      });
    }

    const privateToken = tokenDetailObj?.privateToken!;
    const publicToken = tokenDetailObj?.publicToken!;
    const userId = tokenDetailObj?.user.id;

    const newToken = await createTokenPair({
      payload: { userId, email: shop?.email },
      privateKey: privateToken,
      publicKey: publicToken,
    });

    await tokenDetail?.updateOne({
      $set: {
        refreshToken: newToken?.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      shop,
      tokens: newToken,
    };
  };
}
