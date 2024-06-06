import tokenModel from "models/token.model";

import type { Types } from "mongoose";

type TSaveKeyTokenParams = {
  userId: Types.ObjectId;
  publicKey: string;
  privateKey: string;
};

class TokenService {
  static async saveKeyToken({
    userId,
    publicKey,
    privateKey,
  }: TSaveKeyTokenParams): Promise<boolean> {
    try {
      const token = await tokenModel.create({
        user: userId,
        publicToken: publicKey,
        privateToken: privateKey,
      });

      return token ? true : false;
    } catch (_) {
      return false;
    }
  }
}

export default TokenService;
