import configs from "configs/config";
import { model, Schema, InferRawDocType } from "mongoose";

const schemaDefinitions = {
  key: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  permissions: {
    type: String,
    enum: ["777", "077", "007", "000"],
    default: [],
  },
} as const;

const apiKeySchema = new Schema(schemaDefinitions, {
  collection: configs.schema.apiKey.collectionName,
  timestamps: true,
});

export type TApiKey = InferRawDocType<typeof schemaDefinitions>;

export default model(configs.schema.apiKey.name, apiKeySchema);
