import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const VehiculoForm = ({ initialValues, onSubmit, loading }) => {
    const [form, setForm] = useState({
        marca: "",
        modelo: "",
        anio_fabricacion: "",
        placa: "",
        color: "",
        tipo_vehiculo: "",
        kilometraje: "",
        descripcion: "",
        ...initialValues
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones front
        if (!form.marca || !form.modelo || !form.anio_fabricacion || !form.placa || !form.color || !form.tipo_vehiculo || !form.kilometraje) {
            return toast.error("Por favor completa todos los campos obligatorios");
        }

        if (form.placa.length !== 7) return toast.error("La placa debe tener exactamente 7 caracteres");

        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-2xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-rose-600">{initialValues ? "Editar Vehículo" : "Crear Vehículo"}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} className="input-field" />
                <input type="text" name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} className="input-field" />
                <input type="number" name="anio_fabricacion" placeholder="Año de fabricación" value={form.anio_fabricacion} onChange={handleChange} className="input-field" />
                <input type="text" name="placa" placeholder="Placa" value={form.placa} onChange={handleChange} className="input-field" />
                <input type="text" name="color" placeholder="Color" value={form.color} onChange={handleChange} className="input-field" />
                <input type="text" name="tipo_vehiculo" placeholder="Tipo de vehículo" value={form.tipo_vehiculo} onChange={handleChange} className="input-field" />
                <input type="number" name="kilometraje" placeholder="Kilometraje" value={form.kilometraje} onChange={handleChange} className="input-field" />
                <input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="input-field col-span-1 md:col-span-2" />
            </div>

            <button type="submit" disabled={loading} className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600">
                {loading ? "Guardando..." : "Guardar"}
            </button>
        </form>
    );
};

export default VehiculoForm;