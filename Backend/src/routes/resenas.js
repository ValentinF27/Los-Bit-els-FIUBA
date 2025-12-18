import { Router } from 'express';
const router = Router();
import { pool } from "../db.js";

// Crea reseña.
router.post("/", async (req, res) => {
  try {
    // Extraemos los datos del body de la petición.
    const { usuario_id, partitura_id, titulo, contenido, estrellas } = req.body;

    // Validación básica: todos los campos requeridos.
    if (!usuario_id || !partitura_id || !contenido || !estrellas) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Insertamos la nueva reseña en la base de datos.
    const result = await pool.query(
      `INSERT INTO reseñas (usuario_id, partitura_id, titulo, contenido, estrellas)
      VALUES ($1, $2, $3, $4, $5)`,
      [usuario_id, partitura_id, titulo, contenido, estrellas]
    );

    // Enviamos un status 201 (creado).
    res.sendStatus(201);

  } catch (error) {
    console.error("Error al crear reseña:", error);
    res.status(500).json({ error: "Error de servidor al guardar la reseña." });
  }
});

export default router;
