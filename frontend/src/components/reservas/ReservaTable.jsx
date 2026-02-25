import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useFetch } from "../../hooks/useFetch"
import DashboardLayout from "../../components/layouts/DashboardLayout"

const ReservaTable = () => {
    const fetchData = useFetch()
    const navigate = useNavigate()
    const [reservas, setReservas] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [reservaToDelete, setReservaToDelete] = useState(null)

    // Cargar todas las reservas
    const loadReservas = async () => {
        try {
            setLoading(true)
            const response = await fetchData("/reservas/listar")
            setReservas(response)
        } catch (err) {
            toast.error(err.response?.data?.msg || "Error al cargar reservas")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadReservas()
    }, [])

    const openModal = (reserva) => {
        setReservaToDelete(reserva)
        setShowModal(true)
    }

    const closeModal = () => {
        setReservaToDelete(null)
        setShowModal(false)
    }

    const confirmDelete = async () => {
        try {
            await fetchData(`/reservas/eliminar/${reservaToDelete._id}`, {}, "DELETE")
            toast.success("Reserva eliminada correctamente")
            closeModal()
            loadReservas()
        } catch (err) {
            toast.error(err.response?.data?.msg || "Error al eliminar")
        }
    }

    return (
        <MainLayout>
            <div className="min-h-screen p-6 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
                <h1 className="text-3xl font-bold text-center text-rose-600 mb-8">
                    Lista de Reservas
                </h1>

                {loading ? (
                    <p className="text-center text-gray-500">Cargando reservas...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-xl shadow-lg">
                            <thead className="bg-rose-200 text-rose-900">
                                <tr>
                                    <th className="py-2 px-4 text-left">Código</th>
                                    <th className="py-2 px-4 text-left">Cliente</th>
                                    <th className="py-2 px-4 text-left">Vehículo</th>
                                    <th className="py-2 px-4 text-left">Descripción</th>
                                    <th className="py-2 px-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map((reserva) => (
                                    <tr key={reserva._id} className="border-b hover:bg-rose-50">
                                        <td className="py-2 px-4">{reserva.codigo}</td>
                                        <td className="py-2 px-4">
                                            {reserva.cliente.nombre} {reserva.cliente.apellido} ({reserva.cliente.cedula})
                                        </td>
                                        <td className="py-2 px-4">
                                            {reserva.vehiculo.marca} {reserva.vehiculo.modelo} ({reserva.vehiculo.placa})
                                        </td>
                                        <td className="py-2 px-4">{reserva.descripcion || "-"}</td>
                                        <td className="py-2 px-4 text-center flex justify-center gap-2">
                                            <button
                                                onClick={() => navigate(`/reservas/editar/${reserva._id}`)}
                                                className="px-3 py-1 bg-rose-500 text-white rounded hover:bg-rose-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => openModal(reserva)}
                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* MODAL DE CONFIRMACIÓN */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-96">
                            <h3 className="text-lg font-bold mb-4">Confirmar Eliminación</h3>
                            <p className="mb-6 text-gray-600">
                                ¿Seguro que desea eliminar la reserva <span className="font-semibold">{reservaToDelete?.codigo}</span>?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    )
}

export default ReservaTable