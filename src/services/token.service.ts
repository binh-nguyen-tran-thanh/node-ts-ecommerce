import tokenModel from "models/token.model";

import type { Types } from "mongoose";

type TSaveKeyTokenParams = {
  userId: Types.ObjectId;
  publicKey: string;
  privateKey: string;
  refreshToken: string;
};

class TokenService {
  static async saveKeyToken({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: TSaveKeyTokenParams): Promise<string> {
    try {
      const filter = { user: userId };
      const update = {
        publicToken: publicKey,
        privateToken: privateKey,
        refreshToken,
        refreshTokensUsed: [],
      };

      const options = {
        new: true,
        upsert: true,
      };

      const token = await tokenModel.findOneAndUpdate(filter, update, options);

      return token?.refreshToken || "";
    } catch (_) {
      return "";
    }
  }

  static async findByUserId(userID: string) {
    return await tokenModel.findOne({ user: userID });
  }

  static async deleteByUserId(userID: string) {
    return await tokenModel.deleteOne({ user: userID });
  }

  static async findByAccessTokenUsed(accessToken: string) {
    return await tokenModel.findOne({ accessTokensUsed: accessToken }).lean();
  }

  static async findByAccessToken(accessToken: string) {
    return await tokenModel.findOne({ accessToken }).lean();
  }

  static async deleteById(id: string) {
    return await tokenModel.findByIdAndDelete(id);
  }

  static async deleteAllById(id: string) {
    return await tokenModel.findByIdAndDelete(id);
  }
}

export default TokenService;
