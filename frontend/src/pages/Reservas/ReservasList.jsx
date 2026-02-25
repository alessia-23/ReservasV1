import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useFetch } from "../../hooks/useFetch"

const ReservaList = () => {
    const fetchData = useFetch()
    const navigate = useNavigate()

    const [reservas, setReservas] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [reservaToDelete, setReservaToDelete] = useState(null)

    // Cargar reservas
    const loadReservas = async () => {
        try {
            const data = await fetchData("/reservas/listar", null, "GET")
            setReservas(data)
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
        if (!reservaToDelete) return
        try {
            await fetchData(`/reservas/eliminar/${reservaToDelete._id}`, null, "DELETE")
            toast.success("Reserva eliminada correctamente")
            loadReservas()
            closeModal()
        } catch (err) {
            toast.error(err.response?.data?.msg || "Error al eliminar")
        }
    }

    if (loading) return <p className="text-center mt-6">Cargando reservas...</p>

    return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
                <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-rose-600">Reservas</h2>

                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-rose-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left">Código</th>
                                <th className="px-4 py-2 text-left">Cliente</th>
                                <th className="px-4 py-2 text-left">Vehículo</th>
                                <th className="px-4 py-2 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map(r => (
                                <tr key={r._id} className="border-t">
                                    <td className="px-4 py-2">{r.codigo}</td>
                                    <td className="px-4 py-2">{r.cliente?.nombre} {r.cliente?.apellido}</td>
                                    <td className="px-4 py-2">{r.vehiculo?.marca} {r.vehiculo?.modelo}</td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => navigate(`/reservas/detail/${r._id}`)}
                                            className="px-3 py-1 bg-rose-300 text-white rounded hover:bg-rose-400"
                                        >
                                            Ver
                                        </button>
                                        <button
                                            onClick={() => navigate(`/reservas/edit/${r._id}`)}
                                            className="px-3 py-1 bg-rose-500 text-white rounded hover:bg-rose-600"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => openModal(r)}
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

                {/* MODAL */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-96">
                            <h3 className="text-lg font-bold mb-4 text-rose-600">Confirmar Eliminación</h3>
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
    )
}

export default ReservaList