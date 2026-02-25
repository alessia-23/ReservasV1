import Vehiculo from "../models/Vehiculo.js";
import mongoose from "mongoose";

// CREAR VEHÍCULO

const crearVehiculo = async (req, res) => {
    try {
        const {marca,modelo,anio_fabricacion,placa,color,tipo_vehiculo,kilometraje,descripcion} = req.body;

        // Validar campos obligatorios (los que tú decidas obligatorios)
        if (!marca || !modelo || !anio_fabricacion || !placa || !color || !tipo_vehiculo || !kilometraje || !descripcion) {
            return res.status(400).json({
                error: "Campos obligatorios incompletos"
            });
        }
        // Vemos si existe placas duplicadas, en caso de que is lo cominuicamos al cliente para que ingrese una placa diferente
        const existeVehiculo = await Vehiculo.findOne({ placa });
        if (existeVehiculo) {
            return res.status(400).json({
                error: "La placa ya está registrada"
            });
        }
        const vehiculo = new Vehiculo({marca,modelo,anio_fabricacion,placa,color,tipo_vehiculo,kilometraje,descripcion});
        await vehiculo.save();
        res.status(201).json({
            message: "Vehículo creado correctamente",vehiculo
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

// OBTENER TODOS
const obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.find();
        res.json({
            vehiculos
        });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// BUSCAR POR PLACA O MARCA
const buscarVehiculo = async (req, res) => {
    try {
        let { placa, marca } = req.query;

        if (placa) placa = placa.trim().toUpperCase();
        if (marca) marca = marca.trim();

        // No envía ninguno
        if (!placa && !marca) {
            return res.status(400).json({
                error: "Debe enviar placa o marca"
            });
        }
        // Envía ambos
        if (placa && marca) {
            return res.status(400).json({
                error: "Debe buscar por placa o por marca, no por ambas"
            });
        }
        let filtro = {};
        if (placa) {
            filtro.placa = placa;
        }
        if (marca) {
            filtro.marca = { $regex: marca, $options: "i" };
        }
        const vehiculos = await Vehiculo
            .find(filtro)
            .collation({ locale: "es", strength: 1 });
        if (vehiculos.length === 0) {
            return res.status(404).json({
                error: "No se encontraron vehículos"
            });
        }
        res.json({ vehiculos });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// ACTUALIZAR VEHÍCULO
const actualizarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "ID no válido"
            });
        }
        const datosActualizados = { ...req.body };
        // Eliminar campos vacíos
        Object.keys(datosActualizados).forEach(key => {
            if (datosActualizados[key] === "") {
                delete datosActualizados[key];
            }
        });
        const vehiculo = await Vehiculo.findByIdAndUpdate(
            id,
            datosActualizados,
            {
                new: true,
                runValidators: true
            }
        );
        if (!vehiculo) {
            return res.status(404).json({
                error: "Vehículo no encontrado"
            });
        }
        res.json({
            message: "Vehículo actualizado correctamente",
            vehiculo
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

// ELIMINAR VEHÍCULO
const eliminarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "ID no válido"
            });
        }
        const vehiculo = await Vehiculo.findByIdAndDelete(id);
        if (!vehiculo) {
            return res.status(404).json({
                error: "Vehículo no encontrado"
            });
        }
        res.json({
            message: "Vehículo eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

export {
    crearVehiculo,
    obtenerVehiculos,
    buscarVehiculo,
    actualizarVehiculo,
    eliminarVehiculo
};