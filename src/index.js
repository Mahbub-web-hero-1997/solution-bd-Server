import app from "./app.js";
import connectionDB from "./DB/connectionDB.js";
import dotenv from "dotenv";
dotenv.config();

connectionDB().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("Server running at PORT:", port);
  });
});
