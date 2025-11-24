import books from "./src/routes/books.routes.js";
import places from "./src/routes/places.routes.js";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/books", books);
app.use("/places", places);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfull Connection"))
    .catch((err) => console.log("Connection Error", err))

app.listen(3000, () => console.log("Server in http://localhost:3000"));
