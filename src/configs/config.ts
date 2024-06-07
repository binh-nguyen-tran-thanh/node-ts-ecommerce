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
  },
};

export default configs;
