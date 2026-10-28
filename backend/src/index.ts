import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { iniciarDB } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/proyectos", (req, res) => {
    res.json({ mensaje: "El servidor funciona. Acá van a ir los proyectos." });
});

iniciarDB()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
    })
    .catch((err) => {
    console.error("No se pudo conectar a la base de datos:", err.message);
    });