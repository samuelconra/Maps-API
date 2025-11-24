import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import placesRoutes from "./src/routes/places.routes.js";
// import booksRoutes from "./src/routes/books.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Rutas
app.use("/places", placesRoutes);
// app.use("/books", booksRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conexión exitosa a MongoDB"))
    .catch((err) => console.log("Error de conexión", err));

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));