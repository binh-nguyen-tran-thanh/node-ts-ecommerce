import configs from "configs/config";
import { InferRawDocType, model, Schema } from "mongoose";

const baseProductSchemaDefinition = {
  name: {
    type: String,
    require: true,
  },
  thumbnail: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: configs.schema.shop.name,
    require: true,
  },
  type: {
    type: String,
    enum: ["Electronic", "Clothing", "Furniture"],
  },
  attributes: {
    type: Schema.Types.Mixed,
    required: true,
  },
};

const basProductSchema = new Schema(baseProductSchemaDefinition, {
  timestamps: true,
  collection: configs.schema.product.collectionName,
});

export type TBaseProduct = InferRawDocType<typeof baseProductSchemaDefinition>;
export const productModel = model(
  configs.schema.product.name,
  basProductSchema
);
