import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

export async function iniciarDB() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS proyectos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT NOT NULL,
        tecnologias VARCHAR(255) NOT NULL,
        imagen VARCHAR(500),
        enlace VARCHAR(500),
        estado ENUM('publicado', 'borrador') NOT NULL DEFAULT 'borrador'
    )
    `);
    console.log("Base de datos lista, tabla proyectos verificada");
}

export default pool;