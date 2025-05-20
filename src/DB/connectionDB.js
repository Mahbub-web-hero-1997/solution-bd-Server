import mongoose from "mongoose";

const connectionDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.DB_CONNECTION_URI
    );
    console.log(
      "Database connection Successfully established : ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectionDB;
