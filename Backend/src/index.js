import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

app.get("/usuarios/:id", async (req, res) => {
  try {
    // Tomamos el id desde la URL.
    const { id } = req.params;

    // Pedimos solo ese usuario a la base de datos.
    const result = await pool.query(
      "SELECT id, nickname, nom_completo, email, telefono, ubicacion, instrumento, genero_fav FROM usuarios WHERE id = $1",
      [id]
    );

    // Si no existe, lanza mensaje de error.
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Enviamos el usuario al frontend.
    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB error" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});
