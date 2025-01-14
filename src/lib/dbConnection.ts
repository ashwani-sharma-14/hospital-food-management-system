import mongoose from "mongoose";
const dbURL = process.env.DB_URL;

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function dbConnection(): Promise<void> {
  if (!dbURL) {
    return console.log("URL is not present");
  }
  if (connection.isConnected) {
    console.log("already cnnected to database");
    return;
  }
  try {
    const db = await mongoose.connect(dbURL || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected");
  } catch (err) {
    console.log("database connection failed", err);
    process.exit(1);
  }
}
