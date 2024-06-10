import configs from "configs/config";
import { InferRawDocType, model, Schema } from "mongoose";

const schemaDefinition = {
  brand: {
    type: String,
    require: true,
  },
  size: {
    type: String,
    require: true,
  },
  material: {
    type: String,
    require: true,
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: configs.schema.shop.name,
    require: true,
  },
};

const clothingProductSchema = new Schema(schemaDefinition, {
  timestamps: true,
  collection: configs.schema.clothing.collectionName,
});

export type TClothingProduct = InferRawDocType<typeof schemaDefinition>;
export const clothingProductModel = model(
  configs.schema.clothing.name,
  clothingProductSchema
);
