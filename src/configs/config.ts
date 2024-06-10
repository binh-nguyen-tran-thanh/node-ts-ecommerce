const configs = {
  database: {
    connectionString: process.env.CONNECTION_STRING,
    databaseName: "e-commerce",
    maxPoolSize: 20,
  },
  schema: {
    shop: {
      collectionName: "shops",
      name: "Shop",
    },
    token: {
      collectionName: "tokens",
      name: "Token",
    },
    apiKey: {
      collectionName: "apiKeys",
      name: "apiKey",
    },
    product: {
      collectionName: "products",
      name: "Product",
    },
    electronic: {
      collectionName: "electronics",
      name: "Electronic",
    },
    furniture: {
      collectionName: "furnitures",
      name: "Furniture",
    },
    clothing: {
      collectionName: "clothings",
      name: "Clothing",
    },
  },
};

export default configs;
