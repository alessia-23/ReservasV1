import express from "express";
import { buscarReserva, crearReserva,obtenerReservas,actualizarReserva, eliminarReserva} from "../controllers/reservaController.js";  
import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/crear", protegerRuta, crearReserva);
router.get("/listar", protegerRuta, obtenerReservas);
router.get("/buscar", protegerRuta, buscarReserva);
router.put("/actualizar/:id", protegerRuta, actualizarReserva);
router.delete("/eliminar/:id", protegerRuta, eliminarReserva);
export default router;