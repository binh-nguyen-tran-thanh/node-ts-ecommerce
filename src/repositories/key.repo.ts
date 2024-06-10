import apiKeyModel, { TApiKey } from "models/apiKey.model";

export default class KeyRepository {
  static readonly findActiveKey = (query: Partial<TApiKey>) => {
    return apiKeyModel.findOne({ ...query, status: "active" }).lean();
  };
}
