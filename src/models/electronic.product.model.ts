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

const electronicProductSchema = new Schema(schemaDefinition, {
  timestamps: true,
  collection: configs.schema.electronic.collectionName,
});

export type TElectronicProduct = InferRawDocType<typeof schemaDefinition>;
export const electronicProductModel = model(
  configs.schema.electronic.name,
  electronicProductSchema
);
