import express from "express";
import { crearCliente, obtenerClientes, buscarCliente } from "../controllers/clienteController.js";
import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

// RUTA PARA CREAR CLIENTE
router.post("/crear", protegerRuta, crearCliente);
router.get("/listar", protegerRuta, obtenerClientes);
router.get("/buscar", protegerRuta, buscarCliente);
export default router;