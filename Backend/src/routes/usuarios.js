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

// Crear usuario.
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

    // Validación mínima.
    if (!nickname || !email || !password) {
      return res.status(400).json({
        error: "Nickname, email y password son obligatorios"
      });
    }

    // Verificar duplicados.
    const exists = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1 OR nickname = $2",
      [email, nickname]
    );

     if (exists.rows.length > 0) {
      return res.status(409).json({
        error: "Email o nickname ya registrado"
      });
    }

    // Insertar usuario con nombres de columnas correctos
    const insert = await pool.query(
      `INSERT INTO usuarios
       (nickname, nom_completo, email, "contraseña", telefono, ubicacion, instrumento, genero_fav, fecha_nacimiento, genero)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, nickname, email`,
      [
        nickname,
        name || null,
        email,
        password,
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

// Editar usuario.
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nickname, email } = req.body;

  try {
    // Verificar que el usuario existe
    const usuarioResult = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);
    if (usuarioResult.rows.length === 0) {
      console.log(`Usuario con ID ${id} no encontrado.`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar que el email o nickname no estén duplicados (excluyendo al usuario actual)
    const checkDuplicates = await pool.query(
      "SELECT id FROM usuarios WHERE (email = $1 OR nickname = $2) AND id != $3",
      [email, nickname, id]
    );
    if (checkDuplicates.rows.length > 0) {
      console.log("El email o nickname ya está en uso.");
      return res.status(409).json({
        error: "El email o nickname ya está en uso"
      });
    }

    // Crear los campos para actualizar solo si se pasan en la solicitud
    const fieldsToUpdate = [];
    const values = [];

    // Solo agregamos los campos que fueron enviados
    if (nickname) {
      fieldsToUpdate.push("nickname = $1");
      values.push(nickname);
    }
    if (email) {
      fieldsToUpdate.push("email = $2");
      values.push(email);
    }

    // Si no se proporcionaron datos para actualizar, respondemos con un error
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos para actualizar." });
    }

    // Crear la consulta de actualización.
    // Aquí se asegura que el $3 será para el `id`
    const updateQuery = `
      UPDATE usuarios
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = $${values.length + 1}
      RETURNING id, nickname, email
    `;

    // Añadir el id al final de los valores
    values.push(id);

    // Ejecutar la consulta
    const updatedUser = await pool.query(updateQuery, values);

    // Devolver la respuesta con el usuario actualizado
    console.log("Usuario actualizado:", updatedUser.rows[0]);
    res.json({ user: updatedUser.rows[0] });

  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar los datos del usuario" });
  }
});


// Eliminar usuario.
router.delete("/:id", async (req, res) => {
  try {
    // Correcto: Accediendo a `id` desde req.params
    const { id } = req.params;  // Asegúrate de que esto esté en la ruta correcta

    // Si el ID no está definido correctamente
    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Aquí continua el código para eliminar el usuario...
    console.log(`Eliminando usuario con ID: ${id}`);

    // Procedemos con la eliminación del usuario
    await pool.query(`DELETE FROM usuarios WHERE id = $1`, [id]);

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

export default router;
