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
        publicKey,
        privateKey,
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
}

export default TokenService;
