import apiKeyModel from "models/apiKey.model";

class ApiKeyService {
  static readonly getActiveApiKeyDetail = async (apiKey: string) => {
    const validKey = await apiKeyModel
      .findOne({ key: apiKey, status: "active" })
      .lean();
    return validKey;
  };
}

export default ApiKeyService;
