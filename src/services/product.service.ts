import { ProductType } from "enums/product";
import BadRequestError from "errors/badRequestError";
import { omit } from "lodash";
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
import ClothingProductRepository from "repositories/clothing.repo";
import ElectronicProductRepository from "repositories/electronic.repo";
import FurnitureProductRepository from "repositories/furniture.repor";
import ProductRepository, { TProductPayload } from "repositories/product.repo";
import { AddonType } from "types/common";
import { buildUpdateQueryFromNestedObject } from "utils";

interface ProductInterface<T> {
  _id?: string;
  attributes: Omit<T, "shop" | "_id">;
  name: string;
  type: string;
  description: string;
  quantity: number;
  shop: Types.ObjectId;
  thumbnail: string;
  ratingAverage: number;
  variations: Array<any>;
  createProduct(id?: string): Promise<TBaseProduct>;
  updateProduct(id?: string): Promise<TBaseProduct>;
}

type SupportingProduct = typeof BaseProduct<
  TClothingProduct | TElectronicProduct | TFurnitureProduct
>;

export default class ProductFactory {
  static readonly productRegistry: Record<string, SupportingProduct> = {};
  static registerProductType(type: string, classRef: SupportingProduct) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(payload: Required<TBaseProduct> & AddonType) {
    const productClass = ProductFactory.productRegistry[payload.type];
    if (!productClass) {
      throw new BadRequestError({
        message: "Unsupported Product Type",
      });
    }

    return new productClass(payload).createProduct("");
  }

  static async updateProduct(payload: Required<TBaseProduct> & AddonType) {
    const productClass = ProductFactory.productRegistry[payload.type];
    if (!productClass) {
      throw new BadRequestError({
        message: "Unsupported Product Type",
      });
    }

    return new productClass(payload).updateProduct("");
  }

  static async getAllDraftProduct(
    shop: string,
    limit: number = 50,
    skip: number = 0
  ) {
    return await ProductRepository.queryDraftProduct(
      {
        shop: shop as unknown as Types.ObjectId,
      },
      limit,
      skip
    );
  }

  static async getAllPublishedProduct(
    shop: string,
    limit: number = 50,
    skip: number = 0
  ) {
    return await ProductRepository.queryPublishedProduct(
      {
        shop: shop as unknown as Types.ObjectId,
      },
      limit,
      skip
    );
  }

  static async publishProduct(shop: string, productId: string) {
    const updateCount = await ProductRepository.publishProduct({
      shop: shop as unknown as Types.ObjectId,
      _id: productId,
    });
    if (!updateCount) {
      throw new BadRequestError({
        message: "Product isn't exist or was published",
      });
    }

    return [];
  }

  static async searchProductByText(
    text: string,
    limit: number = 50,
    skip: number = 0
  ) {
    return await ProductRepository.findProductByText(text, limit, skip);
  }

  static async findAllProducts({
    filter,
    sort,
    limit,
    page,
    select,
  }: {
    filter: Partial<TProductPayload>;
    limit: number;
    page: number;
    sort: string;
    select: string[];
  }) {
    return await ProductRepository.findAllProducts({
      filter,
      select: ["name", "thumbnail", "slug", "price", "quantity"].concat(select),
      sort,
      limit,
      page,
    });
  }

  static async findProductDetail({
    id,
    unselect = [],
  }: {
    id: string;
    unselect?: string[];
  }) {
    return (
      (await ProductRepository.findProductDetail({
        unselect: ["__v"].concat(unselect),
        id,
      })) ?? {}
    );
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
  ratingAverage: number;
  variations: Array<any>;
  _id: string;

  constructor(props: Required<TBaseProduct> & AddonType) {
    this.attributes = props.attributes;
    this.name = props.name;
    this.type = props.type;
    this.description = props.description;
    this.quantity = props.quantity;
    this.shop = props.shop;
    this.thumbnail = props.thumbnail;
    this.ratingAverage = props.ratingAverage;
    this.variations = props.variations;
    this._id = props._id ?? "";
  }

  async createProduct(id: string) {
    const createdProduct = await ProductRepository.createProduct({
      name: this.name,
      attributes: this.attributes,
      type: this.type,
      description: this.description,
      quantity: this.quantity,
      shop: this.shop,
      thumbnail: this.thumbnail,
      ratingAverage: this.ratingAverage,
      variations: this.variations,
      _id: id,
    });

    if (!createdProduct) {
      throw new BadRequestError({
        message: "Create product failed",
      });
    }

    return createdProduct as TBaseProduct;
  }

  async updateProduct(id: string) {
    const updateData = buildUpdateQueryFromNestedObject(
      omit(this, ["id", "_id"])
    );

    return (await ProductRepository.updateProductDetail({
      productId: id,
      model: productModel,
      updateData,
      isNew: true,
    })) as TBaseProduct;
  }
}

class ElectronicProduct extends BaseProduct<TElectronicProduct> {
  async createProduct() {
    const createdElectronicProduct =
      await ElectronicProductRepository.createProduct({
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

  async updateProduct() {
    if (this.attributes) {
      await ProductRepository.updateProductDetail({
        productId: this._id,
        updateData: buildUpdateQueryFromNestedObject(this.attributes),
        model: electronicProductModel,
        isNew: true,
      });
    }
    return await super.updateProduct(this._id);
  }
}

class FurnitureProduct extends BaseProduct<TFurnitureProduct> {
  async createProduct() {
    const createdFurnitureProduct =
      await FurnitureProductRepository.createProduct({
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

  async updateProduct() {
    if (this.attributes) {
      await ProductRepository.updateProductDetail({
        productId: this._id,
        updateData: buildUpdateQueryFromNestedObject(this.attributes),
        model: furnitureProductModel,
        isNew: true,
      });
    }
    return await super.updateProduct(this._id);
  }
}

class ClothingProduct extends BaseProduct<TClothingProduct> {
  async createProduct() {
    const createdClothingProduct =
      await ClothingProductRepository.createProduct({
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

  async updateProduct() {
    if (this.attributes) {
      await ProductRepository.updateProductDetail({
        productId: this._id,
        updateData: buildUpdateQueryFromNestedObject(this.attributes),
        model: clothingProductModel,
        isNew: true,
      });
    }
    return await super.updateProduct(this._id);
  }
}

ProductFactory.registerProductType(ProductType.Clothing, ClothingProduct);
ProductFactory.registerProductType(ProductType.Furniture, FurnitureProduct);
ProductFactory.registerProductType(ProductType.Electronic, ElectronicProduct);
