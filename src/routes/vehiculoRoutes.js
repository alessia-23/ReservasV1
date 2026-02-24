import express from "express";
import { crearVehiculo } from "../controllers/vehiculoController.js";
import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

// RUTA PARA CREAR VEHÍCULO
router.post("/crear", protegerRuta, crearVehiculo);

export default router;