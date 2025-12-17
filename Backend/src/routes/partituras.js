import { Router } from 'express';
const router = Router();
import { pool } from "../db.js";

router.get("/:id", async (req, res) => {
  try {
    // Tomamos el id de la partitura desde la URL.
    const { id } = req.params;

    // Traemos la partitura con el nickname del usuario que la subió.
       const partituraResult = await pool.query(
      `SELECT partituras.*, usuarios.nickname
       FROM partituras
       JOIN usuarios ON usuarios.id = partituras.usuario_id
       WHERE partituras.id = $1`,
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

export default router;
