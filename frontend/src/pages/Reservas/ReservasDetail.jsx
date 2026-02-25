import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useFindById } from "../../hooks/useFindById"

const ReservaDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: reserva, loading, error } = useFindById("/reservas/listar", id)

    useEffect(() => {
        if (error) toast.error(error)
    }, [error])

    const handleBack = () => {
        navigate("/reservas/listar")
    }

    if (loading) return <p className="text-center mt-6">Cargando detalles de la reserva...</p>
    if (!reserva) return <p className="text-center mt-6 text-red-500">Reserva no encontrada</p>

    return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-rose-600">Detalle de la Reserva</h2>

                    <div className="mb-3">
                        <span className="font-semibold text-gray-700">Código:</span>{" "}
                        <span className="text-gray-800">{reserva.codigo}</span>
                    </div>

                    {reserva.descripcion && (
                        <div className="mb-3">
                            <span className="font-semibold text-gray-700">Descripción:</span>{" "}
                            <span className="text-gray-800">{reserva.descripcion}</span>
                        </div>
                    )}

                    <div className="mb-3">
                        <span className="font-semibold text-gray-700">Cliente:</span>{" "}
                        <span className="text-gray-800">
                            {reserva.cliente?.nombre} {reserva.cliente?.apellido} ({reserva.cliente?.cedula})
                        </span>
                    </div>

                    <div className="mb-3">
                        <span className="font-semibold text-gray-700">Vehículo:</span>{" "}
                        <span className="text-gray-800">
                            {reserva.vehiculo?.marca} {reserva.vehiculo?.modelo} ({reserva.vehiculo?.placa})
                        </span>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
    )
}

export default ReservaDetail