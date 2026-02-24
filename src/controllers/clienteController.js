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

export { crearCliente };