import tokenModel, { TToken } from "models/token.model";

export default class TokenRepository {
  static async deleteById(id: string) {
    return await tokenModel.findByIdAndDelete(id);
  }

  static async findToken(
    query: Partial<TToken>,
    select: Record<string, number> = {}
  ) {
    return await tokenModel.findOne(query).select(select).lean();
  }

  static async findTokenWithoutLean(
    query: Partial<TToken>,
    select: Record<string, number> = {}
  ) {
    return await tokenModel.findOne(query).select(select);
  }

  static async findTokenAndUpdate(
    query: Partial<TToken>,
    update: Record<string, any> = {},
    options: Record<string, boolean> = {}
  ) {
    return await tokenModel.findOneAndUpdate(query, update, options);
  }

  static async deleteToken(query: Partial<TToken>) {
    return await tokenModel.deleteOne(query);
  }
}
