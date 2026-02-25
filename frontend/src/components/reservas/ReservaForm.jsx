import { useState, useEffect } from "react"

const ReservaForm = ({ onSubmit, initialData = {}, clientes = [], vehiculos = [] }) => {
    const [form, setForm] = useState({
        codigo: initialData.codigo || "",
        descripcion: initialData.descripcion || "",
        cliente: initialData.cliente?._id || "",
        vehiculo: initialData.vehiculo?._id || ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.codigo || !form.cliente || !form.vehiculo) {
            alert("Por favor complete los campos obligatorios")
            return
        }
        onSubmit(form)
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-rose-600">Formulario de Reserva</h2>

            <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Código *</label>
                <input
                    type="text"
                    name="codigo"
                    value={form.codigo}
                    onChange={handleChange}
                    placeholder="Código de la reserva"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Cliente *</label>
                <select
                    name="cliente"
                    value={form.cliente}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
                    required
                >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map(c => (
                        <option key={c._id} value={c._id}>
                            {c.nombre} {c.apellido} ({c.cedula})
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Vehículo *</label>
                <select
                    name="vehiculo"
                    value={form.vehiculo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
                    required
                >
                    <option value="">Seleccione un vehículo</option>
                    {vehiculos.map(v => (
                        <option key={v._id} value={v._id}>
                            {v.marca} {v.modelo} ({v.placa})
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-6">
                <label className="block mb-1 font-semibold text-gray-700">Descripción</label>
                <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción opcional"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
                    rows={3}
                ></textarea>
            </div>

            <button
                type="submit"
                className="w-full bg-rose-500 text-white font-bold py-2 px-4 rounded hover:bg-rose-600 transition-colors"
            >
                Guardar Reserva
            </button>
        </form>
    )
}

export default ReservaForm