import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import apiClient from "../../services/apiClient"

const ClienteTable = () => {

    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(true)

    const [showModal, setShowModal] = useState(false)
    const [clienteToDelete, setClienteToDelete] = useState(null)

    // CARGAR CLIENTES
    const cargarClientes = async () => {
        try {
            const { data } = await apiClient.get("/clientes/listar")
            setClientes(data.clientes)
        } catch (error) {
            toast.error("Error al cargar clientes")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarClientes()
    }, [])

    // MODAL CONTROL
    const openModal = (cliente) => {
        setClienteToDelete(cliente)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setClienteToDelete(null)
    }

    // CONFIRM DELETE
    const confirmDelete = async () => {
        try {
            await apiClient.delete(`/clientes/eliminar/${clienteToDelete._id}`)
            toast.success("Cliente eliminado correctamente")
            closeModal()
            cargarClientes()
        } catch (error) {
            toast.error("Error al eliminar cliente")
        }
    }

    // RENDER
    if (loading) {
        return <p className="text-center mt-4">Cargando clientes...</p>
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4 text-coral fw-bold">
                Lista de Clientes
            </h2>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Cédula</th>
                            <th>Ciudad</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente._id}>
                                <td>
                                    {cliente.nombre} {cliente.apellido}
                                </td>
                                <td>{cliente.cedula}</td>
                                <td>{cliente.ciudad}</td>
                                <td>{cliente.telefono}</td>
                                <td>{cliente.email}</td>
                                <td>
                                    <button
                                        onClick={() => openModal(cliente)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* =======================
                MODAL
            ======================= */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-coral">
                        <h3>Confirmar Eliminación</h3>

                        <p>
                            ¿Seguro que desea eliminar a{" "}
                            <span className="fw-bold">
                                {clienteToDelete?.nombre} {clienteToDelete?.apellido}
                            </span>?
                        </p>

                        <div className="modal-buttons">
                            <button
                                onClick={closeModal}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="btn btn-danger"
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

export default ClienteTable