import KeyRepository from "repositories/key.repo";

class ApiKeyService {
  static readonly getActiveApiKeyDetail = async (apiKey: string) => {
    const validKey = await KeyRepository.findActiveKey({ key: apiKey });
    return validKey;
  };
}

export default ApiKeyService;
