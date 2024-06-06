import configs from "configs/config";
import { model, Schema, InferRawDocType } from "mongoose";

const schemaDefinitions = {
  name: {
    type: String,
    trim: true,
    maxLength: 150,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  verify: {
    type: Schema.Types.Boolean,
    default: false,
  },
  roles: {
    type: Schema.Types.Array,
    default: [],
  },
} as const;

const shopSchema = new Schema(schemaDefinitions, {
  collection: configs.schema.shop.collectionName,
  timestamps: true,
});

export type TShop = InferRawDocType<typeof schemaDefinitions>;

export default model(configs.schema.shop.name, shopSchema);
