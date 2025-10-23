import express from "express";
import 'dotenv/config';
import cors from "cors";

import notasRoutes from './routes/notas.js';
import usuariosRoutes from './routes/usuarios.js';

const app = express();
const PORT = process.env.PORT || 5040;

app.use(express.json());
app.use(cors());

app.use('/', notasRoutes);
app.use('/', usuariosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor iniciando en http://localhost:${PORT}`);
});


