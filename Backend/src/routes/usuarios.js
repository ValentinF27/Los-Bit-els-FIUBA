import { Router } from 'express';
const router = Router();
import { pool } from "../db.js";

// Login verificar nickname y password.
router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;

  try {
    // Buscar usuario por nickname.
    const usuarioResult = await pool.query(
      "SELECT * FROM usuarios WHERE nickname = $1",
      [nickname]
    );

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = usuarioResult.rows[0];

    // Verificar contraseña.
    if (usuario.contraseña !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Si todo bien, devolvemos datos del usuario
    res.json(usuario);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB error" });
  }
});

// Muestra usuario.
router.get("/:id", async (req, res) => {
  try {
    // Tomamos el id desde la URL.
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

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
