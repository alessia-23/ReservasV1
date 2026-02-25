import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const VehiculoList = () => {
    const fetchData = useFetch();
    const [vehiculos, setVehiculos] = useState([]);
    const [modal, setModal] = useState({ abierto: false, id: null });

    const obtenerVehiculos = async () => {
        try {
            const res = await fetchData("/vehiculos/listar");
            setVehiculos(res.vehiculos);
        } catch (error) {
            toast.error(error?.error || "Error al cargar vehículos");
        }
    };

    const eliminarVehiculo = async (id) => {
        try {
            await fetchData(`/vehiculos/eliminar/${id}`, {}, "DELETE");
            toast.success("Vehículo eliminado");
            setModal({ abierto: false, id: null });
            obtenerVehiculos();
        } catch (error) {
            toast.error(error?.error || "Error al eliminar vehículo");
        }
    };

    useEffect(() => {
        obtenerVehiculos();
    }, []);

    return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4 text-rose-600">Vehículos</h1>
                <Link
                    to="/vehiculos/crear"
                    className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 mb-4 inline-block"
                >
                    Crear Vehículo
                </Link>

                <table className="min-w-full bg-white shadow rounded">
                    <thead className="bg-rose-100">
                        <tr>
                            <th className="py-2 px-4">Marca</th>
                            <th className="py-2 px-4">Modelo</th>
                            <th className="py-2 px-4">Placa</th>
                            <th className="py-2 px-4">Color</th>
                            <th className="py-2 px-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehiculos.map((v) => (
                            <tr key={v._id} className="border-t">
                                <td className="py-2 px-4">{v.marca}</td>
                                <td className="py-2 px-4">{v.modelo}</td>
                                <td className="py-2 px-4">{v.placa}</td>
                                <td className="py-2 px-4">{v.color}</td>
                                <td className="py-2 px-4 space-x-2">
                                    <Link
                                        to={`/vehiculos/detalle/${v._id}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Ver
                                    </Link>
                                    <Link
                                        to={`/vehiculos/editar/${v._id}`}
                                        className="text-green-500 hover:underline"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => setModal({ abierto: true, id: v._id })}
                                        className="text-red-500 hover:underline"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal de confirmación */}
                {modal.abierto && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded shadow max-w-sm w-full">
                            <h2 className="text-lg font-bold mb-4 text-rose-600">
                                Confirmar eliminación
                            </h2>
                            <p className="mb-4">¿Estás seguro que deseas eliminar este vehículo?</p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setModal({ abierto: false, id: null })}
                                    className="px-4 py-2 rounded border border-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => eliminarVehiculo(modal.id)}
                                    className="px-4 py-2 rounded bg-rose-500 text-white hover:bg-rose-600"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default VehiculoList;