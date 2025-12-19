import { Router } from 'express';
const router = Router();
import { pool } from "../db.js";

// Obtener una reseña por id.
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Consultar la base de datos por la reseña con el ID proporcionado
    const result = await pool.query("SELECT * FROM reseñas WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }

    // Si la reseña existe, la enviamos en la respuesta
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al cargar la reseña:", error);
    res.status(500).json({ error: "Error al cargar la reseña." });
  }
});

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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, contenido, estrellas } = req.body;

  try {
    // Verificar que la reseña existe.
    const resenaResult = await pool.query("SELECT * FROM reseñas WHERE id = $1", [id]);
    if (resenaResult.rows.length === 0) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }

    // Construir la parte del SET para la consulta.
    const fieldsToUpdate = [];
    const values = [];

    // Solo agregamos los campos que fueron enviados.
    if (titulo) {
      fieldsToUpdate.push("titulo = $1");
      values.push(titulo);
    }

    if (contenido) {
      fieldsToUpdate.push("contenido = $2");
      values.push(contenido);
    }

    if (estrellas) {
      fieldsToUpdate.push("estrellas = $3");
      values.push(estrellas);
    }

    // Si no hay nada para actualizar, devolvemos un error
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos para actualizar." });
    }

    // Agregar la fecha de modificación al final.
    fieldsToUpdate.push("fecha_modificacion = CURRENT_TIMESTAMP");
    values.push(id);

    // Crear la consulta de actualización.
    const updateQuery = `
      UPDATE reseñas
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = $${values.length}
      RETURNING id, titulo, contenido, estrellas, fecha_modificacion, partitura_id
    `;

    // Ejecutar la consulta
    const updatedResena = await pool.query(updateQuery, values);

    // Devolver la reseña actualizada
    res.json(updatedResena.rows[0]);

  } catch (error) {
    console.error("Error al actualizar la reseña:", error);
    res.status(500).json({ error: "Error al actualizar la reseña" });
  }
});

export default router;
