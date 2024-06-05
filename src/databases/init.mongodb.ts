import configs from "configs/config";
import mongoose from "mongoose";

class Database {
  private constructor() {
    this.connect();
  }

  private static _instance: Database;

  async connect() {
    try {
      if (process.env.ENV === "dev") {
        mongoose.set("debug", { color: true });
      }

      await mongoose.connect(configs.database.connectionString!);
      console.info("Connected to DB");
    } catch (error) {
      console.log("Fail to connect to database: ", error);
    }
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new Database();
    }

    return this._instance;
  }
}

const instance = Database.instance;

export default instance;
