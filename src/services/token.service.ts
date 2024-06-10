import tokenModel from "models/token.model";

import type { ObjectId, Types } from "mongoose";
import TokenRepository from "repositories/token.repo";

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

      const token = await TokenRepository.findTokenAndUpdate(
        filter,
        update,
        options
      );

      return token?.refreshToken ?? "";
    } catch (_) {
      return "";
    }
  }

  static async findByUserId(userID: string) {
    return await TokenRepository.findTokenWithoutLean({
      user: userID as unknown as Types.ObjectId,
    });
  }

  static async deleteByUserId(userID: string) {
    return await TokenRepository.deleteToken({
      user: userID as unknown as Types.ObjectId,
    });
  }

  static async deleteAllById(id: string) {
    return await TokenRepository.deleteById(id);
  }
}

export default TokenService;
