import Cliente from "../models/Cliente.js";
import mongoose from "mongoose";

// CREAR CLIENTE
const crearCliente = async (req, res) => {
    try {
        const {nombre,apellido,cedula,fecha_nacimiento,ciudad,direccion,telefono,email} = req.body;
        if (!nombre || !apellido || !cedula || !fecha_nacimiento || !direccion || !telefono || !email ||!ciudad) {
            return res.status(400).json({
                error: "Campos obligatorios incompletos"
            });
        }
        const existeCliente = await Cliente.findOne({ cedula });
        if (existeCliente) {
            return res.status(400).json({
                error: "La cédula ya está registrada"
            });
        }
        const cliente = new Cliente({nombre,apellido,cedula,fecha_nacimiento,ciudad,direccion,telefono,email});
        await cliente.save();
        res.status(201).json({
            message: "Cliente creado correctamente",
            cliente
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// OBTENER TODOS LOS CLIENTES
const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json({ clientes });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// BUSCAR POR CÉDULA O APELLIDO
const buscarCliente = async (req, res) => {
    try {
        let { cedula, apellido } = req.query;
        if (cedula) cedula = cedula.trim();
        if (apellido) apellido = apellido.trim();
        if (!cedula && !apellido) {
            return res.status(400).json({
                error: "Debe enviar cédula o apellido"
            });
        }
        if (cedula && apellido) {
            return res.status(400).json({
                error: "Debe buscar por cédula o por apellido, no por ambos"
            });
        }
        let filtro = {};
        if (cedula) filtro.cedula = cedula;
        if (apellido) filtro.apellido = { $regex: apellido, $options: "i" };
        const clientes = await Cliente.find(filtro);
        if (clientes.length === 0) {
            return res.status(404).json({
                error: "No se encontraron clientes"
            });
        }
        res.json({ clientes });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

export { 
    crearCliente,
    obtenerClientes,
    buscarCliente
};