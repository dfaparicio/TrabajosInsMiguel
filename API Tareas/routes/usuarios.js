import express from "express";
import {
    agregarusuario,
    obtenerusuarios,
    eliminarusuario
} from "../controllers/usuarios.js";

const router = express.Router();

router.post("/agregarusuario", agregarusuario);
// http://localhost:5040/agregarusuario

router.get("/listadeusuarios", obtenerusuarios);
// http://localhost:5040/listadeusuarios

router.delete("/usuario/:identificacion", eliminarusuario);
// http://localhost:5040/usuario/identificacion?eliminarnotas=true
// http://localhost:5040/usuario/identificacion


export default router;


