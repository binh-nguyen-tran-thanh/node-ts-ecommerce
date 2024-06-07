import configs from "configs/config";
import { Schema, model, InferRawDocType } from "mongoose";

const schemaDefinitions = {
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: configs.schema.shop.name,
  },
  publicToken: {
    type: String,
    require: true,
  },
  privateToken: {
    type: String,
    require: true,
  },
  refreshTokenUsed: {
    type: Array,
    default: [],
  },
  refreshToken: {
    type: String,
    require: true,
  },
};

const tokenSchema = new Schema(schemaDefinitions, {
  collection: configs.schema.token.collectionName,
  timestamps: true,
});

export type TToken = InferRawDocType<typeof schemaDefinitions>;

export default model(configs.schema.token.name, tokenSchema);
