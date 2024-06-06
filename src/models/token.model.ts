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
  refreshToken: {
    type: Array,
    default: [],
  },
};

const tokenSchema = new Schema(schemaDefinitions, {
  collection: configs.schema.token.collectionName,
  timestamps: true,
});

export type TToken = InferRawDocType<typeof schemaDefinitions>;

export default model(configs.schema.token.name, tokenSchema);
