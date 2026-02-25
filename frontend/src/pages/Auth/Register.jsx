import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";

const Register = () => {
    const navigate = useNavigate();
    const { login, user } = useContext(AuthContext);
    const fetchData = useFetch();

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 🔒 Redirección automática si ya está autenticado
    useEffect(() => {
        if (user) navigate("/register");
    }, [user, navigate]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const validarFormulario = () => {
        const { nombre, apellido, email, password, confirmPassword } = form;

        if (!nombre || !apellido || !email || !password || !confirmPassword) {
            toast.error("Todos los campos son obligatorios");
            return false;
        }

        if (password.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres");
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Ingrese un correo válido");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        try {
            setLoading(true);

            const res = await fetchData.post("/auth/register", {
                nombre: form.nombre,
                apellido: form.apellido,
                email: form.email,
                password: form.password,
            });

            toast.success(res.data.msg || "Usuario registrado correctamente");

            // Login automático después del registro
            login(res.data.user);
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 px-4">
            <ToastContainer />
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/40">
                <h2 className="text-2xl font-bold text-rose-600 text-center mb-2">
                    Crear Cuenta
                </h2>
                <p className="text-gray-500 text-sm text-center mb-6">
                    Sistema de Reservas
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
                        required
                        autoFocus
                    />

                    {/* Apellido */}
                    <input
                        type="text"
                        name="apellido"
                        placeholder="Apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
                        required
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
                        required
                    />

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-rose-400 focus:outline-none transition pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2 text-gray-500"
                        >
                            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-rose-400 focus:outline-none transition pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2 text-gray-500"
                        >
                            {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-xl font-semibold bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white transition duration-300 shadow-md disabled:opacity-60"
                    >
                        {loading ? "Registrando..." : "Crear Cuenta"}
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-600">
                    ¿Ya tienes cuenta?{" "}
                    <span
                        onClick={() => navigate("/")}
                        className="text-orange-500 hover:text-orange-600 cursor-pointer font-medium"
                    >
                        Inicia sesión
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;