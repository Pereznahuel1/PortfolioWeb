import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { iniciarDB } from "./db";
import rutas from "./rutas";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/proyectos", rutas);

iniciarDB()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
    })
    .catch((err) => {
    console.error("No se pudo conectar a la base de datos:", err.message);
    });