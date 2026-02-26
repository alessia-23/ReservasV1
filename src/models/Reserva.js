import mongoose from "mongoose";

// Para hacer las relaciones del cliente y el vehiculo, se utiliza el tipo ObjectId y se referencia a los modelos correspondientes.
const reservaSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    descripcion: {
        type: String,
        trim: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true
    },
    vehiculo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehiculo",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model("Reserva", reservaSchema);