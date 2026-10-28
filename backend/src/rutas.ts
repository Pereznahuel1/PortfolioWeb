import { Router } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "./db";
import { Proyecto, NuevoProyecto, EstadoProyecto } from "./tipos";

const router = Router();

const ESTADOS: EstadoProyecto[] = ["publicado", "borrador"];

// Validación básica de los datos recibidos
function validar(body: any): string | null {
  if (!body.nombre || typeof body.nombre !== "string" || !body.nombre.trim()) {
    return "El nombre es obligatorio";
  }
  if (!body.descripcion || typeof body.descripcion !== "string" || !body.descripcion.trim()) {
    return "La descripción es obligatoria";
  }
  if (!body.tecnologias || typeof body.tecnologias !== "string" || !body.tecnologias.trim()) {
    return "Las tecnologías son obligatorias";
  }
  if (body.estado && !ESTADOS.includes(body.estado)) {
    return "El estado debe ser 'publicado' o 'borrador'";
  }
  return null;
}

// CONSULTAR: GET /api/proyectos
router.get("/", async (req, res) => {
  try {
    const [filas] = await pool.query<(Proyecto & RowDataPacket)[]>(
      "SELECT * FROM proyectos ORDER BY id DESC"
    );
    res.json(filas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los proyectos" });
  }
});

// CREAR: POST /api/proyectos
router.post("/", async (req, res) => {
  const error = validar(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const nuevo: NuevoProyecto = {
    nombre: req.body.nombre.trim(),
    descripcion: req.body.descripcion.trim(),
    tecnologias: req.body.tecnologias.trim(),
    imagen: req.body.imagen || null,
    estado: req.body.estado || "borrador",
  };

  try {
    const [resultado] = await pool.query<ResultSetHeader>(
      "INSERT INTO proyectos (nombre, descripcion, tecnologias, imagen, estado) VALUES (?, ?, ?, ?, ?)",
      [nuevo.nombre, nuevo.descripcion, nuevo.tecnologias, nuevo.imagen, nuevo.estado]
    );
    const creado: Proyecto = { id: resultado.insertId, ...nuevo };
    res.status(201).json(creado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
});

// MODIFICAR: PUT /api/proyectos/:id
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "El id no es válido" });
  }

  const error = validar(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const datos: NuevoProyecto = {
    nombre: req.body.nombre.trim(),
    descripcion: req.body.descripcion.trim(),
    tecnologias: req.body.tecnologias.trim(),
    imagen: req.body.imagen || null,
    estado: req.body.estado || "borrador",
  };

  try {
    const [resultado] = await pool.query<ResultSetHeader>(
      "UPDATE proyectos SET nombre = ?, descripcion = ?, tecnologias = ?, imagen = ?, estado = ? WHERE id = ?",
      [datos.nombre, datos.descripcion, datos.tecnologias, datos.imagen, datos.estado, id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    const actualizado: Proyecto = { id, ...datos };
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al modificar el proyecto" });
  }
});

// ELIMINAR: DELETE /api/proyectos/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "El id no es válido" });
  }

  try {
    const [resultado] = await pool.query<ResultSetHeader>(
      "DELETE FROM proyectos WHERE id = ?",
      [id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.json({ mensaje: "Proyecto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el proyecto" });
  }
});

export default router;