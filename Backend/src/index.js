import express from "express";
import cors from "cors";

import usuarios from "./routes/usuarios.js";
import partituras from "./routes/partituras.js";

const app = express();
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

app.use('/api/usuarios', usuarios);
app.use('/api/partituras', partituras);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});
