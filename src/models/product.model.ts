import configs from "configs/config";
import { InferRawDocType, model, Schema, InferSchemaType } from "mongoose";
import slugify from "slugify";

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
  slug: String,
  ratingAverage: {
    type: Number,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be above 1.0"],
    set: (val: any) => Math.round(val * 10) / 10,
  },
  variations: {
    type: Array,
    default: [],
  },
  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
};

const basProductSchema = new Schema(baseProductSchemaDefinition, {
  timestamps: true,
  collection: configs.schema.product.collectionName,
});

basProductSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

basProductSchema.index({ name: "text", description: "text" });

export type TBaseProduct = InferRawDocType<typeof baseProductSchemaDefinition>;
export const productModel = model(
  configs.schema.product.name,
  basProductSchema
);
