import mongoose from "mongoose";

export const getConnectionCount = () => {
  const connections = mongoose.connections.length;

  return connections;
};
