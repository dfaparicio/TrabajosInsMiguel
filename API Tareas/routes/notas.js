import express from "express";
import {
  agregarnota,
  obtenertodas,
  obtenerpornombre,
  obtenerporestado,
  modificardescripcion,
  modificarestado,
  eliminarnota,
  interpretarnota,
  obtenernotasporusuario
  
} from "../controllers/notas.js";

const router = express.Router();

router.post("/agregarnota", agregarnota);
// http://localhost:5040/agregarnota

router.get("/listadetareas", obtenertodas);
// http://localhost:5040/listadetareas

router.get("/obtenerpornombre", obtenerpornombre);
// http://localhost:5040/obtenerpornombre?nombre=Actividad1

router.get("/obtenerporestado", obtenerporestado);
// http://localhost:5040/obtenerporestado?estado=COMPLETADA
// http://localhost:5040/obtenerporestado?estado=PENDIENTE

router.put("/notas/:nombre/descripcion", modificardescripcion);
// http://localhost:5040/notas/:nombre/descripcion

router.put("/notas/:nombre/estado", modificarestado);
// http://localhost:5040/notas/:nombre/estado

router.delete("/notas/:nombre", eliminarnota);
// http://localhost:5040/notas/:nombre

router.get("/interpretar-nota/:nombre", interpretarnota);
// http://localhost:5040/interpretar-nota/Actividad001

router.get("/notas/:id", obtenernotasporusuario);
// http://localhost:5040/notas/123
export default router;
