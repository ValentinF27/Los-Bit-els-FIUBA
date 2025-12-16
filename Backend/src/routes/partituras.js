import { Router } from 'express';
const router = Router();
import { pool } from "../db.js";

router.get("/:id", async (req, res) => {
  try {
    // Tomamos el id de la partitura desde la URL.
    const { id } = req.params;

    // Pedimos solo esa partitura a la base de datos.
       const result = await pool.query(
      `SELECT partituras.*, usuarios.nickname
       FROM partituras
       JOIN usuarios ON usuarios.id = partituras.usuario_id
       WHERE partituras.id = $1`,
      [id]
    );

    // Si no existe, lanza mensaje de error.
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Partitura no encontrada" });
    }

    // Enviamos la partitura al frontend.
    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
