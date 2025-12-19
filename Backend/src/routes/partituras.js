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

// Actualiza una partitura
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, artista, genero, instrumento, nivel, duracion, descripcion, pdf, audio, imagen, usuario_id } = req.body;

  try {
    // Verificar que la partitura existe.
    const partituraResult = await pool.query("SELECT * FROM partituras WHERE id = $1", [id]);
    if (partituraResult.rows.length === 0) {
      return res.status(404).json({ error: "Partitura no encontrada" });
    }

    // Verificar que el usuario logueado es el propietario de la partitura.
    const partitura = partituraResult.rows[0];
    if (partitura.usuario_id !== usuario_id) {
      return res.status(403).json({ error: "No tienes permisos para actualizar esta partitura" });
    }

    // Construir la parte del SET para la consulta (solo los campos enviados).
    const fieldsToUpdate = [];
    const values = [];

    // Solo agregamos los campos que fueron enviados
    if (nombre) {
      fieldsToUpdate.push("nombre = $1");
      values.push(nombre);
    }
    if (artista) {
      fieldsToUpdate.push("artista = $2");
      values.push(artista);
    }
    if (genero) {
      fieldsToUpdate.push("genero = $3");
      values.push(genero);
    }
    if (instrumento) {
      fieldsToUpdate.push("instrumento = $4");
      values.push(instrumento);
    }
    if (nivel) {
      fieldsToUpdate.push("nivel = $5");
      values.push(nivel);
    }
    if (duracion) {
      fieldsToUpdate.push("duracion = $6");
      values.push(duracion);
    }
    if (descripcion) {
      fieldsToUpdate.push("descripcion = $7");
      values.push(descripcion);
    }
    if (pdf) {
      fieldsToUpdate.push("pdf = $8");
      values.push(pdf);
    }
    if (audio) {
      fieldsToUpdate.push("audio = $9");
      values.push(audio);
    }
    if (imagen) {
      fieldsToUpdate.push("imagen = $10");
      values.push(imagen);
    }

    // Si no se proporciona ningún dato para actualizar
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos para actualizar." });
    }

    // Agregar la fecha de modificación
    fieldsToUpdate.push("fecha_modificacion = CURRENT_TIMESTAMP");
    values.push(id);

    // Crear la consulta de actualización
    const updateQuery = `
      UPDATE partituras
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = $${values.length}
      RETURNING *`;

    // Ejecutar la consulta
    const updatedPartitura = await pool.query(updateQuery, values);

    // Devolver la partitura actualizada
    res.json(updatedPartitura.rows[0]);

  } catch (error) {
    console.error("Error al actualizar la partitura:", error);
    res.status(500).json({ error: "Error al actualizar la partitura" });
  }
});

// Crear partitura
router.post("/", async (req, res) => {
  const { nombre, artista, genero, instrumento, nivel, duracion, descripcion, pdf, audio, imagen, usuario_id } = req.body;

  try {
    // Verificar que el usuario esté logueado
    if (!usuario_id) {
      return res.status(400).json({ error: "El usuario debe estar logueado para crear una partitura" });
    }

    // Verificar que los campos obligatorios estén presentes
    if (!nombre || !pdf) {
      return res.status(400).json({ error: "Faltan campos obligatorios: nombre o pdf" });
    }

    // Insertar la nueva partitura
    const result = await pool.query(
      `INSERT INTO partituras 
        (nombre, usuario_id, pdf, audio, artista, genero, instrumento, nivel, duracion, descripcion, imagen)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *`,
      [nombre, usuario_id, pdf, audio, artista, genero, instrumento, nivel, duracion, descripcion, imagen]
    );

    // Retornar la partitura creada
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear la partitura:", error);
    res.status(500).json({ error: "Hubo un error al crear la partitura" });
  }
});

export default router;
