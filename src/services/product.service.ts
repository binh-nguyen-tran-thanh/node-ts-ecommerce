import { ProductType } from "enums/product";
import BadRequestError from "errors/badRequestError";
import {
  clothingProductModel,
  TClothingProduct,
} from "models/clothing.product.model";
import {
  electronicProductModel,
  TElectronicProduct,
} from "models/electronic.product.model";
import {
  furnitureProductModel,
  TFurnitureProduct,
} from "models/furniture.product.model";
import { productModel, TBaseProduct } from "models/product.model";
import { Types } from "mongoose";

interface ProductInterface<T> {
  attributes: Omit<T, "shop" | "_id">;
  name: string;
  type: string;
  description: string;
  quantity: number;
  shop: Types.ObjectId;
  thumbnail: string;
  createProduct(id: string): Promise<TBaseProduct>;
}

type SupportingProduct = typeof BaseProduct<
  TClothingProduct | TElectronicProduct | TFurnitureProduct
>;

export default class ProductFactory {
  static productRegistry: Record<string, SupportingProduct> = {};
  static registerProductType(type: string, classRef: SupportingProduct) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(payload: Required<TBaseProduct>) {
    const productClass = ProductFactory.productRegistry[payload.type];
    if (!productClass) {
      throw new BadRequestError({
        message: "Unsupported Product Type",
      });
    }

    return new productClass(payload);
  }
}

class BaseProduct<T> implements ProductInterface<T> {
  attributes: Omit<T, "shop" | "_id">;
  name: string;
  type: string;
  description: string;
  quantity: number;
  shop: Types.ObjectId;
  thumbnail: string;

  constructor(props: Required<TBaseProduct>) {
    this.attributes = props.attributes;
    this.name = props.name;
    this.type = props.type;
    this.description = props.description;
    this.quantity = props.quantity;
    this.shop = props.shop;
    this.shop = props.shop;
    this.thumbnail = props.thumbnail;
  }

  async createProduct(id: string) {
    const createdProduct = await productModel.create({
      name: this.name,
      attributes: this.attributes,
      type: this.type,
      description: this.description,
      quantity: this.quantity,
      shop: this.shop,
      thumbnail: this.thumbnail,
      _id: id,
    });
    if (!createdProduct) {
      throw new BadRequestError({
        message: "Create product failed",
      });
    }

    return createdProduct as TBaseProduct;
  }
}

class ElectronicProduct extends BaseProduct<TElectronicProduct> {
  constructor(props: Required<TBaseProduct>) {
    {
      super(props);
    }
  }

  async createProduct() {
    const createdElectronicProduct = await electronicProductModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!createdElectronicProduct) {
      throw new BadRequestError({
        message: "Create electronic product failed",
      });
    }

    const createdProduct = await super.createProduct(
      createdElectronicProduct.id
    );

    return createdProduct;
  }
}

class FurnitureProduct extends BaseProduct<TFurnitureProduct> {
  constructor(props: Required<TBaseProduct>) {
    {
      super(props);
    }
  }

  async createProduct() {
    const createdFurnitureProduct = await furnitureProductModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!createdFurnitureProduct) {
      throw new BadRequestError({
        message: "Create furniture product failed",
      });
    }

    const createdProduct = await super.createProduct(
      createdFurnitureProduct.id
    );

    return createdProduct;
  }
}

class ClothingProduct extends BaseProduct<TClothingProduct> {
  constructor(props: Required<TBaseProduct>) {
    {
      super(props);
    }
  }

  async createProduct() {
    const createdClothingProduct = await clothingProductModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!createdClothingProduct) {
      throw new BadRequestError({
        message: "Create clothing product failed",
      });
    }

    const createdProduct = await super.createProduct(createdClothingProduct.id);

    return createdProduct;
  }
}

ProductFactory.registerProductType(ProductType.Clothing, ClothingProduct);
ProductFactory.registerProductType(ProductType.Furniture, FurnitureProduct);
ProductFactory.registerProductType(ProductType.Electronic, ElectronicProduct);
