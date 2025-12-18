import { Router } from 'express';
const router = Router();
import { pool } from "../db.js";


// GET /partituras/populares
router.get("/populares", async (req, res) => {
  const result = await pool.query(`
    SELECT p.*, AVG(r.estrellas) AS promedio
    FROM partituras p
    JOIN reseñas r ON r.partitura_id = p.id
    GROUP BY p.id
    HAVING AVG(r.estrellas) >= 4
    ORDER BY MAX(r.fecha_creacion) DESC
    LIMIT 4
  `);
  res.json(result.rows);
});


// GET /partituras/recientes
router.get("/recientes", async (req, res) => {
  const result = await pool.query(`
    SELECT *
    FROM partituras
    ORDER BY fecha_creacion DESC
    LIMIT 4
  `);
  res.json(result.rows);
});
  


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

router.get("/", async (req, res) => {
  const { query } = req.query;

  const result = await pool.query(
    `SELECT p.id,
       p.nombre,
       p.artista,
       p.genero,
       p.instrumento,
       p.imagen,
       AVG(reseñas.estrellas) AS promedio
    FROM partituras p
    LEFT JOIN reseñas ON reseñas.partitura_id = p.id
    WHERE nombre ILIKE $1
      OR artista ILIKE $1
      OR instrumento ILIKE $1
      OR genero ILIKE $1
    GROUP BY p.id, p.nombre, p.artista, p.genero, p.instrumento, p.imagen
    ORDER BY promedio DESC NULLS LAST`,
    [`%${query}%`]
  );

  res.json(result.rows);
});

  
export default router;
