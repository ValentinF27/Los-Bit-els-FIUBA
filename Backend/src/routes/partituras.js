import { Router } from 'express';
const router = Router();
import { pool } from "../db.js";

// Muestra partitura.
router.get("/:id", async (req, res) => {
  try {
    // Tomamos el id de la partitura desde la URL.
    const { id } = req.params;

    // Traemos la partitura con el nickname del usuario que la subió.
       const partituraResult = await pool.query(
        `SELECT p.*, u.nickname,
                ROUND(COALESCE(AVG(r.estrellas),0),2) AS promedio_estrellas
        FROM partituras p
        JOIN usuarios u ON u.id = p.usuario_id
        LEFT JOIN reseñas r ON r.partitura_id = p.id
        WHERE p.id = $1
        GROUP BY p.id, u.nickname`,
        [id]
      );

    // Si no existe, lanza mensaje de error.
    if (partituraResult.rows.length === 0) {
      return res.status(404).json({ error: "Partitura no encontrada" });
    }

    const partitura = partituraResult.rows[0];

    // Traemos todas las reseñas de esa partitura.
    const reseñasResult = await pool.query(
      `SELECT reseñas.*, usuarios.nickname AS usuario_nickname, usuarios.email AS usuario_email
       FROM reseñas
       JOIN usuarios ON usuarios.id = reseñas.usuario_id
       WHERE reseñas.partitura_id = $1
       ORDER BY reseñas.fecha_creacion DESC`,
      [id]
    );

    // Agregamos las reseñas al objeto partitura.
    partitura.reseñas = reseñasResult.rows;

    // Enviamos la partitura al frontend.
    res.json(partitura);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB error" });
  }
});

// Elimina partitura.
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id } = req.body;

    // Buscamos la partitura para verificar si el usuario es el propietario
    const partituraResult = await pool.query(
      `SELECT * FROM partituras WHERE id = $1`,
      [id]
    );

    // Si no existe la partitura
    if (partituraResult.rows.length === 0) {
      return res.status(404).json({ error: "Partitura no encontrada" });
    }

    const partitura = partituraResult.rows[0];

    // Verificar que el usuario logueado es el propietario de la partitura
    if (partitura.usuario_id !== usuario_id) {
      return res.status(403).json({ error: "No tienes permisos para eliminar esta partitura" });
    }

    // Eliminar la partitura (las reseñas se eliminarán automáticamente debido al CASCADE)
    await pool.query(`DELETE FROM partituras WHERE id = $1`, [id]);

    // Enviar respuesta de éxito
    res.status(200).json({ message: "Partitura eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al eliminar la partitura" });
  }
});

export default router;
