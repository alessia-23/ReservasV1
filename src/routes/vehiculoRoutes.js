import express from "express";
import { crearVehiculo, obtenerVehiculos, buscarVehiculo,actualizarVehiculo, eliminarVehiculo} from "../controllers/vehiculoController.js";
import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

// RUTA PARA CREAR VEHÍCULO
router.post("/crear", protegerRuta, crearVehiculo);
router.get("/listar", protegerRuta, obtenerVehiculos);
router.get("/buscar", protegerRuta, buscarVehiculo);
router.put("/actualizar/:id", protegerRuta, actualizarVehiculo);
router.delete("/eliminar/:id", protegerRuta, eliminarVehiculo);
export default router;