import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useFetch } from "../../hooks/useFetch"
import { useFindById } from "../../hooks/useFindById"

const ReservaEdit = () => {
    const { id } = useParams()
    const fetchData = useFetch()
    const navigate = useNavigate()
    const { data: reserva, loading, error } = useFindById("/reservas/listar", id)

    const [form, setForm] = useState({
        codigo: "",
        descripcion: "",
        cliente: "",
        vehiculo: ""
    })

    const [clientes, setClientes] = useState([])
    const [vehiculos, setVehiculos] = useState([])

    // Cargar datos iniciales de la reserva
    useEffect(() => {
        if (reserva) {
            setForm({
                codigo: reserva.codigo || "",
                descripcion: reserva.descripcion || "",
                cliente: reserva.cliente?._id || "",
                vehiculo: reserva.vehiculo?._id || ""
            })
        }
    }, [reserva])

    // Cargar clientes y vehículos para selects dinámicos
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const clientesResp = await fetchData("/clientes/listar", null, "GET")
                setClientes(clientesResp.clientes || [])

                const vehiculosResp = await fetchData("/vehiculos/listar", null, "GET")
                setVehiculos(vehiculosResp.vehiculos || [])
            } catch (err) {
                toast.error("Error al cargar clientes o vehículos")
            }
        }
        fetchOptions()
    }, [fetchData])

    useEffect(() => {
        if (error) toast.error(error)
    }, [error])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (!form.codigo || !form.cliente || !form.vehiculo) {
            toast.error("Código, cliente y vehículo son obligatorios")
            return
        }

        try {
            await fetchData(`/reservas/actualizar/${id}`, form, "PUT")
            toast.success("Reserva actualizada correctamente")
            navigate("/reservas/listar")
        } catch (err) {
            toast.error(err.response?.data?.msg || "Error al actualizar reserva")
        }
    }

    if (loading) return <p className="text-center mt-6">Cargando reserva...</p>
    if (!reserva) return <p className="text-center mt-6 text-red-500">Reserva no encontrada</p>

    return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-rose-600">Editar Reserva</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Código *</label>
                            <input
                                type="text"
                                name="codigo"
                                value={form.codigo}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                                placeholder="Código de la reserva"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Descripción</label>
                            <textarea
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                                placeholder="Descripción opcional"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Cliente *</label>
                            <select
                                name="cliente"
                                value={form.cliente}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                            >
                                <option value="">Seleccione un cliente</option>
                                {clientes.map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.nombre} {c.apellido} ({c.cedula})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Vehículo *</label>
                            <select
                                name="vehiculo"
                                value={form.vehiculo}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                            >
                                <option value="">Seleccione un vehículo</option>
                                {vehiculos.map(v => (
                                    <option key={v._id} value={v._id}>
                                        {v.marca} {v.modelo} ({v.placa})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => navigate("/reservas/listar")}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    )
}

export default ReservaEdit