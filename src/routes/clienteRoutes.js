import express from "express";
import { crearCliente, obtenerClientes, buscarCliente, actualizarCliente } from "../controllers/clienteController.js";
import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

// RUTA PARA CREAR CLIENTE
router.post("/crear", protegerRuta, crearCliente);
router.get("/listar", protegerRuta, obtenerClientes);
router.get("/buscar", protegerRuta, buscarCliente);
router.put("/actualizar/:id", protegerRuta, actualizarCliente);
export default router;