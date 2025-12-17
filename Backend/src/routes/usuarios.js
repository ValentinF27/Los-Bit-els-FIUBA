import { Router } from 'express';
const router = Router();
import { pool } from "../db.js";

router.get("/:id", async (req, res) => {
  try {
    // Tomamos el id desde la URL.
    const { id } = req.params;

    // Pedimos solo ese usuario a la base de datos.
    const usuarioResult = await pool.query(
      "SELECT * from usuarios WHERE id = $1",
      [id]
    );

    // Si no existe, lanza mensaje de error.
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = usuarioResult.rows[0];

    // Traemos todas las partituras asociadas a ese usuario.
    const partiturasResult = await pool.query(
      `SELECT partituras.*
       FROM partituras
       JOIN usuarios ON usuarios.id = partituras.usuario_id
       WHERE partituras.usuario_id = $1
       ORDER BY partituras.fecha_creacion DESC`,
      [id]
    );

    // Agregamos las partituras al objeto ususario.
    usuario.partituras = partiturasResult.rows;

    // Enviamos el usuario al frontend.
    res.json(usuario);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
