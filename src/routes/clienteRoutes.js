import express from "express";
import { crearCliente } from "../controllers/clienteController.js";
import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

// RUTA PARA CREAR CLIENTE
router.post("/crear", protegerRuta, crearCliente);

export default router;