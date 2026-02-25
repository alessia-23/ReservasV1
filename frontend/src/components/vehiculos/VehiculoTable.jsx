import { Link } from "react-router-dom";

const VehiculoTable = ({ vehiculos, onDelete }) => {
    return (
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
                            <Link to={`/vehiculos/detalle/${v._id}`} className="text-blue-500 hover:underline">Ver</Link>
                            <Link to={`/vehiculos/editar/${v._id}`} className="text-green-500 hover:underline">Editar</Link>
                            <button onClick={() => onDelete(v._id)} className="text-red-500 hover:underline">Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default VehiculoTable;