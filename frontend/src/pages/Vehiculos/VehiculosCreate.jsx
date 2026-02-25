import { useState } from "react";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const VehiculoCreate = () => {
    const fetchData = useFetch();

    const [form, setForm] = useState({
        marca: "",
        modelo: "",
        anio_fabricacion: "",
        placa: "",
        color: "",
        tipo_vehiculo: "",
        kilometraje: "",
        descripcion: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        const { marca, modelo, anio_fabricacion, placa, color, tipo_vehiculo, kilometraje, descripcion } = form;
        if (!marca || !modelo || !anio_fabricacion || !placa || !color || !tipo_vehiculo || !kilometraje || !descripcion) {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        try {
            await fetchData("/vehiculos/crear", form, "POST");
            toast.success("Vehículo creado correctamente");
            setForm({
                marca: "",
                modelo: "",
                anio_fabricacion: "",
                placa: "",
                color: "",
                tipo_vehiculo: "",
                kilometraje: "",
                descripcion: "",
            });
        } catch (error) {
            toast.error(error?.error || "Error al crear vehículo");
        }
    };

    return (
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-rose-600">Crear Vehículo</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {[
                        { label: "Marca", name: "marca", type: "text" },
                        { label: "Modelo", name: "modelo", type: "text" },
                        { label: "Año de Fabricación", name: "anio_fabricacion", type: "number" },
                        { label: "Placa", name: "placa", type: "text" },
                        { label: "Color", name: "color", type: "text" },
                        { label: "Tipo de Vehículo", name: "tipo_vehiculo", type: "text" },
                        { label: "Kilometraje", name: "kilometraje", type: "number" },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block mb-1 font-medium">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={form[field.name]}
                                onChange={handleChange}
                                className="w-full border border-rose-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block mb-1 font-medium">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            className="w-full border border-rose-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition"
                    >
                        Crear Vehículo
                    </button>
                </form>
            </div>
    );
};

export default VehiculoCreate;