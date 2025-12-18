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

/* =========================
   POST CREAR USUARIO
========================= */
router.post("/", async (req, res) => {
  try {
    const {
      nickname,
      name,
      email,
      password,
      phone,
      location,
      instruments,
      genres,
      birth,
      gender
    } = req.body;

    // Validación mínima
    if (!nickname || !email || !password) {
      return res.status(400).json({
        error: "Nickname, email y password son obligatorios"
      });
    }

    // Verificar duplicados
    const exists = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1 OR nickname = $2",
      [email, nickname]
    );

     if (exists.rows.length > 0) {
      return res.status(409).json({
        error: "Email o nickname ya registrado"
      });
    }

    // Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario con nombres de columnas correctos
    const insert = await pool.query(
      `INSERT INTO usuarios
       (nickname, nom_completo, email, contraseña, telefono, ubicacion, instrumento, genero_fav, fecha_nacimiento, genero)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, nickname, email`,
      [
        nickname,
        name || null,
        email,
        hashedPassword,
        phone || null,
        location || null,
        instruments || null,
        genres || null,
        birth || null,
        gender || null
      ]
    );

    res.status(201).json({
      ok: true,
      user: insert.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;



