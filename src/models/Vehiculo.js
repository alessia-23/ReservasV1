import mongoose from "mongoose";

const vehiculoSchema = new mongoose.Schema({
    marca: {
        type: String,
        trim: true
    },
    modelo: {
        type: String,
        trim: true
    },
    anio_fabricacion: {
        type: Number,
        validate: {
            validator: function (value) {
                const anioActual = new Date().getFullYear();
                return value >= 1950 && value <= anioActual;
            },
            message: "Ingrese un año válido"
        }
    },
    placa: {
        type: String,
        unique: true,
        trim: true,
        uppercase: true,
        minlength: [7, "La placa debe tener exactamente 7 caracteres"],
        maxlength: [7, "La placa debe tener exactamente 7 caracteres"]
    },
    color: {
        type: String,
        trim: true
    },
    tipo_vehiculo: {
        type: String,
        trim: true
    },
    kilometraje: {
        type: Number,
        min: [0, "El kilometraje no puede ser negativo"]
    },
    descripcion: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model("Vehiculo", vehiculoSchema);