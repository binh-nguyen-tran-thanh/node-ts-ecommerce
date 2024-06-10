import configs from "configs/config";
import { InferRawDocType, model, Schema } from "mongoose";

const schemaDefinition = {
  manufacturer: {
    type: String,
    require: true,
  },
  model: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    require: true,
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: configs.schema.shop.name,
    require: true,
  },
};

const furnitureProductSchema = new Schema(schemaDefinition, {
  timestamps: true,
  collection: configs.schema.furniture.collectionName,
});

export type TFurnitureProduct = InferRawDocType<typeof schemaDefinition>;
export const furnitureProductModel = model(
  configs.schema.furniture.name,
  furnitureProductSchema
);
