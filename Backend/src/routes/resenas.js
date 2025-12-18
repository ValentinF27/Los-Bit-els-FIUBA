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

// Elimina reseña por ID
router.delete("/:id", async (req, res) => {
  const reseñaId = req.params.id;
  const usuarioId = req.body.usuario_id;

  try {
    // Verificamos si la reseña existe.
    const result = await pool.query(
      `SELECT * FROM reseñas WHERE id = $1`, [reseñaId]
    );
    const reseña = result.rows[0];

    if (!reseña) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }

    // Verificamos si el usuario logueado es el propietario de la reseña.
    if (reseña.usuario_id !== usuarioId) {
      return res.status(403).json({ error: "No puedes eliminar esta reseña. No eres el autor." });
    }

    // Eliminar la reseña de la base de datos
    await pool.query(
      `DELETE FROM reseñas WHERE id = $1`, [reseñaId]
    );

    // Enviamos una respuesta de éxito
    res.status(200).json({ message: "Reseña eliminada correctamente" });

  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    res.status(500).json({ error: "Error de servidor al eliminar la reseña." });
  }
});

export default router;
