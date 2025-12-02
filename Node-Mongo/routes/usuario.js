import { Router } from "express";
import { deleteUsuario, getUsuario, postUsuario, putUsuario, putUsuarioActivar, putUsuarioInactivar } from "../controllers/usuario.js";


const router = new Router()

router.get("/", getUsuario)
router.post("/", postUsuario)
router.put("/:id", putUsuario)
router.put("/activar",putUsuarioActivar)
router.put("/inactivar",putUsuarioInactivar)
router.delete("/", deleteUsuario)

export default router