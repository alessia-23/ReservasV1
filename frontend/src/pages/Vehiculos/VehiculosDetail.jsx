import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const VehiculoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fetchData = useFetch();
    const [vehiculo, setVehiculo] = useState(null);

    const obtenerVehiculo = async () => {
        try {
            const res = await fetchData(`/vehiculos/buscar?id=${id}`);
            if (res.vehiculos && res.vehiculos.length > 0) {
                setVehiculo(res.vehiculos[0]);
            } else {
                toast.error("Vehículo no encontrado");
                navigate("/vehiculos");
            }
        } catch (error) {
            toast.error(error?.error || "Error al obtener vehículo");
        }
    };

    useEffect(() => {
        obtenerVehiculo();
    }, [id]);

    if (!vehiculo) return null;

    return (
            <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
                <h1 className="text-2xl font-bold mb-6 text-rose-600">Detalle del Vehículo</h1>
                <ul className="space-y-2 text-gray-700">
                    <li><strong>Marca:</strong> {vehiculo.marca}</li>
                    <li><strong>Modelo:</strong> {vehiculo.modelo}</li>
                    <li><strong>Año de Fabricación:</strong> {vehiculo.anio_fabricacion}</li>
                    <li><strong>Placa:</strong> {vehiculo.placa}</li>
                    <li><strong>Color:</strong> {vehiculo.color}</li>
                    <li><strong>Tipo de Vehículo:</strong> {vehiculo.tipo_vehiculo}</li>
                    <li><strong>Kilometraje:</strong> {vehiculo.kilometraje}</li>
                    <li><strong>Descripción:</strong> {vehiculo.descripcion}</li>
                </ul>
            </div>
    );
};

export default VehiculoDetail;