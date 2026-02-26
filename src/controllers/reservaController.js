import Reserva from "../models/Reserva.js";
import Cliente from "../models/Cliente.js";
import Vehiculo from "../models/Vehiculo.js";
import mongoose from "mongoose";

// CREAR RESERVA
const crearReserva = async (req, res) => {
    try {
        const { codigo, descripcion, cliente, vehiculo } = req.body;
        // Validar campos obligatorios
        if (!codigo || !cliente || !vehiculo) {
            return res.status(400).json({ msg: "Campos obligatorios incompletos" });
        }
        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(cliente) || !mongoose.Types.ObjectId.isValid(vehiculo)) {
            return res.status(400).json({ msg: "ID de cliente o vehículo no válido" });
        }
        // Verificar existencia
        const [existeCliente, existeVehiculo] = await Promise.all([
            Cliente.findById(cliente),
            Vehiculo.findById(vehiculo)
        ]);
        if (!existeCliente || !existeVehiculo) {
            return res.status(404).json({ msg: "Cliente o vehículo no encontrados" });
        }
        // Validar duplicado por código
        const yaExisteCodigo = await Reserva.findOne({ codigo });
        if (yaExisteCodigo) {
            return res.status(400).json({ msg: "El código de la reserva ya está en uso" });
        }
        // Validar duplicado cliente + vehículo
        const yaReservado = await Reserva.findOne({ cliente, vehiculo });
        if (yaReservado) {
            return res.status(400).json({ msg: "Este cliente ya reservó este vehículo" });
        }
        // Crear reserva
        const reserva = await Reserva.create({ codigo, descripcion, cliente, vehiculo });
        res.status(201).json({
            msg: "Reserva creada correctamente",
            reserva
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ msg: error.message });
        }
        console.error(error);
        res.status(500).json({ msg: "Error del servidor al crear reserva" });
    }
};

// OBTENER RESERVAS
const obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find()
            .populate("cliente", "nombre apellido cedula")
            .populate("vehiculo", "marca modelo placa");
        res.json(reservas);
    } catch (error) {
        res.status(500).json({
            msg: "Error del servidor al obtener reservas"
        });
    }
};

// BUSCAR RESERVA
const buscarReserva = async (req, res) => {
    try {
        let { codigo, placa, cedula } = req.query;
        if (codigo) codigo = codigo.trim().toUpperCase();
        if (placa) placa = placa.trim().toUpperCase();
        if (cedula) cedula = cedula.trim();
        // No envía nada
        if (!codigo && !placa && !cedula) {
            return res.status(400).json({
                msg: "Debe enviar código, placa o cédula"
            });
        }
        //  Envía más de uno
        const parametros = [codigo, placa, cedula].filter(Boolean);
        if (parametros.length > 1) {
            return res.status(400).json({
                msg: "Debe buscar solo por un parámetro a la vez"
            });
        }
        let filtro = {};
        // 🔎 Buscar por código
        if (codigo) {
            filtro.codigo = codigo;
        }
        //  Buscar por placa
        if (placa) {
            const vehiculo = await Vehiculo.findOne({ placa });
            if (!vehiculo) {
                return res.status(404).json({
                    msg: "Vehículo no encontrado"
                });
            }
            filtro.vehiculo = vehiculo._id;
        }
        // Buscar por cédula del cliente
        if (cedula) {
            const cliente = await Cliente.findOne({ cedula });
            if (!cliente) {
                return res.status(404).json({
                    msg: "Cliente no encontrado"
                });
            }
            filtro.cliente = cliente._id;
        }
        const reservas = await Reserva.find(filtro)
            .populate("cliente", "nombre apellido cedula")
            .populate("vehiculo", "marca modelo placa");
        if (reservas.length === 0) {
            return res.status(404).json({
                msg: "No se encontraron reservas"
            });
        }
        res.json({ reservas });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error del servidor"
        });
    }
};

// ACTUALIZAR RESERVA
const actualizarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: "ID no válido"
            });
        }
        const reserva = await Reserva.findById(id);
        if (!reserva) {
            return res.status(404).json({
                msg: "Reserva no encontrada"
            });
        }
        const { codigo, descripcion, cliente, vehiculo } = req.body;
        // Validar código único si viene
        if (codigo) {
            const codigoExiste = await Reserva.findOne({
                codigo,
                _id: { $ne: id }
            });
            if (codigoExiste) {
                return res.status(400).json({
                    msg: "El código ya está en uso"
                });
            }
            reserva.codigo = codigo;
        }
        // Validar cliente si viene
        if (cliente) {
            if (!mongoose.Types.ObjectId.isValid(cliente)) {
                return res.status(400).json({
                    msg: "ID de cliente no válido"
                });
            }
            const existeCliente = await Cliente.findById(cliente);
            if (!existeCliente) {
                return res.status(404).json({
                    msg: "Cliente no encontrado"
                });
            }
            reserva.cliente = cliente;
        }
        // Validar vehículo si viene
        if (vehiculo) {
            if (!mongoose.Types.ObjectId.isValid(vehiculo)) {
                return res.status(400).json({
                    msg: "ID de vehículo no válido"
                });
            }
            const existeVehiculo = await Vehiculo.findById(vehiculo);
            if (!existeVehiculo) {
                return res.status(404).json({
                    msg: "Vehículo no encontrado"
                });
            }
            reserva.vehiculo = vehiculo;
        }
        // Validar que no exista duplicado cliente + vehículo
        const yaReservado = await Reserva.findOne({
            cliente: reserva.cliente,
            vehiculo: reserva.vehiculo,
            _id: { $ne: id }
        });
        if (yaReservado) {
            return res.status(400).json({
                msg: "Ya existe una reserva con este cliente y vehículo"
            });
        }
        if (descripcion !== undefined) {
            reserva.descripcion = descripcion;
        }
        await reserva.save();
        res.json({
            msg: "Reserva actualizada correctamente",
            reserva
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error del servidor al actualizar reserva"
        });
    }
};

// ELIMINAR RESERVA
const eliminarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: "ID no válido"
            });
        }
        const reserva = await Reserva.findByIdAndDelete(id);
        if (!reserva) {
            return res.status(404).json({
                msg: "Reserva no encontrada"
            });
        }
        res.json({
            msg: "Reserva eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error del servidor"
        });
    }
};

export { 
    crearReserva,
    obtenerReservas,
    buscarReserva,
    actualizarReserva,
    eliminarReserva 
};