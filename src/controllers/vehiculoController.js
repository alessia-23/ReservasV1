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

export {
    crearVehiculo
};